/**
 * Export utilities for different formats
 * Supports JSON, JSON-LD, and basic GraphML
 */

import { GraphNode, GraphEdge, OntologySchema } from '@/types';

export interface ExportData {
  schema: OntologySchema | null;
  nodes: GraphNode[];
  edges: GraphEdge[];
  metadata: {
    exportedAt: string;
    version: string;
    application: string;
  };
}

/**
 * Export graph as JSON
 */
export function exportAsJSON(
  nodes: GraphNode[],
  edges: GraphEdge[],
  schema: OntologySchema | null
): string {
  const data: ExportData = {
    schema,
    nodes,
    edges,
    metadata: {
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
      application: 'SemantiKit Ontology Workbench',
    },
  };
  
  return JSON.stringify(data, null, 2);
}

/**
 * Export graph as JSON-LD (Linked Data format)
 */
export function exportAsJSONLD(
  nodes: GraphNode[],
  edges: GraphEdge[],
  schema: OntologySchema | null
): string {
  const context: Record<string, any> = {
    '@vocab': schema?.namespace || 'http://example.org/ontology#',
    'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    'rdfs': 'http://www.w3.org/2000/01/rdf-schema#',
  };
  
  // Convert nodes to JSON-LD entities
  const entities = nodes.map((node) => {
    const entity: Record<string, any> = {
      '@id': `#${node.id}`,
      '@type': node.data.type,
      'label': node.data.label,
    };
    
    // Add properties
    for (const [key, value] of Object.entries(node.data.properties)) {
      entity[key] = value;
    }
    
    return entity;
  });
  
  // Add edges as relationships
  edges.forEach((edge) => {
    const sourceEntity = entities.find((e) => e['@id'] === `#${edge.source}`);
    if (sourceEntity) {
      if (!sourceEntity[edge.data.type]) {
        sourceEntity[edge.data.type] = [];
      }
      sourceEntity[edge.data.type].push({
        '@id': `#${edge.target}`,
      });
    }
  });
  
  const jsonld = {
    '@context': context,
    '@graph': entities,
  };
  
  return JSON.stringify(jsonld, null, 2);
}

/**
 * Export graph as GraphML (XML format for graph visualization tools)
 */
export function exportAsGraphML(
  nodes: GraphNode[],
  edges: GraphEdge[],
  schema: OntologySchema | null
): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<graphml xmlns="http://graphml.graphdrawing.org/xmlns"\n';
  xml += '         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n';
  xml += '         xsi:schemaLocation="http://graphml.graphdrawing.org/xmlns\n';
  xml += '         http://graphml.graphdrawing.org/xmlns/1.0/graphml.xsd">\n';
  
  // Define keys for node attributes
  xml += '  <key id="d0" for="node" attr.name="type" attr.type="string"/>\n';
  xml += '  <key id="d1" for="node" attr.name="label" attr.type="string"/>\n';
  xml += '  <key id="d2" for="edge" attr.name="type" attr.type="string"/>\n';
  xml += '  <key id="d3" for="edge" attr.name="label" attr.type="string"/>\n';
  
  xml += '  <graph id="G" edgedefault="directed">\n';
  
  // Add nodes
  for (const node of nodes) {
    xml += `    <node id="${escapeXml(node.id)}">\n`;
    xml += `      <data key="d0">${escapeXml(node.data.type)}</data>\n`;
    xml += `      <data key="d1">${escapeXml(node.data.label)}</data>\n`;
    xml += `    </node>\n`;
  }
  
  // Add edges
  for (const edge of edges) {
    xml += `    <edge source="${escapeXml(edge.source)}" target="${escapeXml(edge.target)}">\n`;
    xml += `      <data key="d2">${escapeXml(edge.data.type)}</data>\n`;
    if (edge.data.label) {
      xml += `      <data key="d3">${escapeXml(edge.data.label)}</data>\n`;
    }
    xml += `    </edge>\n`;
  }
  
  xml += '  </graph>\n';
  xml += '</graphml>';
  
  return xml;
}

/**
 * Stub for OWL/RDF export (to be implemented)
 */
export function exportAsOWL(
  nodes: GraphNode[],
  edges: GraphEdge[],
  schema: OntologySchema | null
): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE rdf:RDF [
  <!ENTITY owl "http://www.w3.org/2002/07/owl#" >
  <!ENTITY xsd "http://www.w3.org/2001/XMLSchema#" >
  <!ENTITY rdfs "http://www.w3.org/2000/01/rdf-schema#" >
  <!ENTITY rdf "http://www.w3.org/1999/02/22-rdf-syntax-ns#" >
]>

<rdf:RDF xmlns="${schema?.namespace || 'http://example.org/ontology#'}"
     xml:base="${schema?.namespace || 'http://example.org/ontology'}"
     xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
     xmlns:owl="http://www.w3.org/2002/07/owl#"
     xmlns:xsd="http://www.w3.org/2001/XMLSchema#"
     xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#">
    
    <owl:Ontology rdf:about="${schema?.namespace || 'http://example.org/ontology'}">
        <rdfs:label>${schema?.name || 'Unnamed Ontology'}</rdfs:label>
        <rdfs:comment>${schema?.description || 'No description'}</rdfs:comment>
    </owl:Ontology>
    
    <!-- OWL export is a work in progress -->
    <!-- Full implementation coming soon -->
    
</rdf:RDF>`;
}

/**
 * Download file helper
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain'): void {
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
 * Helper to escape XML special characters
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

