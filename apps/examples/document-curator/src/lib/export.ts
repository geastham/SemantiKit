import { Document, Entity, EntityLink } from '@/types';

/**
 * Export data as JSON
 */
export function exportAsJSON(
  documents: Document[],
  entities: Entity[],
  links: EntityLink[]
): string {
  const data = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    statistics: {
      documentCount: documents.length,
      entityCount: entities.length,
      linkCount: links.length,
    },
    documents,
    entities,
    links,
  };

  return JSON.stringify(data, null, 2);
}

/**
 * Export entities and links as GraphML (XML format for graph visualization tools)
 */
export function exportAsGraphML(entities: Entity[], links: EntityLink[]): string {
  const escape = (str: string) => 
    str.replace(/&/g, '&amp;')
       .replace(/</g, '&lt;')
       .replace(/>/g, '&gt;')
       .replace(/"/g, '&quot;')
       .replace(/'/g, '&apos;');

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<graphml xmlns="http://graphml.graphdrawing.org/xmlns">\n';
  xml += '  <key id="label" for="node" attr.name="label" attr.type="string"/>\n';
  xml += '  <key id="type" for="node" attr.name="type" attr.type="string"/>\n';
  xml += '  <key id="confidence" for="node" attr.name="confidence" attr.type="double"/>\n';
  xml += '  <key id="approved" for="node" attr.name="approved" attr.type="boolean"/>\n';
  xml += '  <key id="linkType" for="edge" attr.name="type" attr.type="string"/>\n';
  xml += '  <key id="linkConfidence" for="edge" attr.name="confidence" attr.type="double"/>\n';
  xml += '  <graph id="G" edgedefault="directed">\n';

  // Add nodes
  entities.forEach((entity) => {
    xml += `    <node id="${escape(entity.id)}">\n`;
    xml += `      <data key="label">${escape(entity.text)}</data>\n`;
    xml += `      <data key="type">${escape(entity.type)}</data>\n`;
    xml += `      <data key="confidence">${entity.confidence}</data>\n`;
    xml += `      <data key="approved">${entity.approved || false}</data>\n`;
    xml += `    </node>\n`;
  });

  // Add edges
  links.forEach((link, index) => {
    xml += `    <edge id="e${index}" source="${escape(link.sourceEntityId)}" target="${escape(link.targetEntityId)}">\n`;
    xml += `      <data key="linkType">${escape(link.type)}</data>\n`;
    xml += `      <data key="linkConfidence">${link.confidence}</data>\n`;
    xml += `    </edge>\n`;
  });

  xml += '  </graph>\n';
  xml += '</graphml>';

  return xml;
}

/**
 * Export as CSV (entities)
 */
export function exportEntitiesAsCSV(entities: Entity[]): string {
  const headers = ['ID', 'Text', 'Type', 'Confidence', 'Approved', 'Rejected', 'Document ID'];
  const rows = entities.map((entity) => [
    entity.id,
    `"${entity.text.replace(/"/g, '""')}"`, // Escape quotes
    entity.type,
    entity.confidence.toString(),
    entity.approved ? 'true' : 'false',
    entity.rejected ? 'true' : 'false',
    entity.documentId,
  ]);

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}

/**
 * Export links as CSV
 */
export function exportLinksAsCSV(links: EntityLink[], entities: Entity[]): string {
  const entityMap = new Map(entities.map(e => [e.id, e]));
  
  const headers = ['Source ID', 'Source Text', 'Target ID', 'Target Text', 'Link Type', 'Confidence'];
  const rows = links.map((link) => {
    const source = entityMap.get(link.sourceEntityId);
    const target = entityMap.get(link.targetEntityId);
    return [
      link.sourceEntityId,
      source ? `"${source.text.replace(/"/g, '""')}"` : '',
      link.targetEntityId,
      target ? `"${target.text.replace(/"/g, '""')}"` : '',
      link.type,
      link.confidence.toString(),
    ];
  });

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}

/**
 * Generate embeddings-ready format (for vector databases)
 */
export function exportForEmbeddings(entities: Entity[]): string {
  const data = entities.map((entity) => ({
    id: entity.id,
    text: entity.text,
    type: entity.type,
    confidence: entity.confidence,
    documentId: entity.documentId,
    context: entity.metadata?.context || '',
    metadata: {
      approved: entity.approved,
      rejected: entity.rejected,
      extractedAt: entity.metadata?.extractedAt,
    },
  }));

  return JSON.stringify(data, null, 2);
}

/**
 * Download data as a file
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export options
 */
export type ExportFormat = 'json' | 'graphml' | 'csv-entities' | 'csv-links' | 'embeddings';

export interface ExportOptions {
  format: ExportFormat;
  includeDocuments?: boolean;
  includeEntities?: boolean;
  includeLinks?: boolean;
  filename?: string;
}

/**
 * Main export function
 */
export function exportData(
  documents: Document[],
  entities: Entity[],
  links: EntityLink[],
  options: ExportOptions
) {
  const timestamp = new Date().toISOString().split('T')[0];
  let content = '';
  let filename = options.filename || `document-curator-${timestamp}`;
  let mimeType = 'text/plain';

  switch (options.format) {
    case 'json':
      content = exportAsJSON(documents, entities, links);
      filename += '.json';
      mimeType = 'application/json';
      break;

    case 'graphml':
      content = exportAsGraphML(entities, links);
      filename += '.graphml';
      mimeType = 'application/xml';
      break;

    case 'csv-entities':
      content = exportEntitiesAsCSV(entities);
      filename += '-entities.csv';
      mimeType = 'text/csv';
      break;

    case 'csv-links':
      content = exportLinksAsCSV(links, entities);
      filename += '-links.csv';
      mimeType = 'text/csv';
      break;

    case 'embeddings':
      content = exportForEmbeddings(entities);
      filename += '-embeddings.json';
      mimeType = 'application/json';
      break;

    default:
      throw new Error(`Unsupported export format: ${options.format}`);
  }

  downloadFile(content, filename, mimeType);
}

