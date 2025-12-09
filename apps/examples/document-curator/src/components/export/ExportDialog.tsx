'use client';

import { useState } from 'react';
import { useDocumentStore } from '@/lib/document-store';
import { exportData, ExportFormat } from '@/lib/export';
import { X, Download, FileJson, FileCode, FileSpreadsheet, Database } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExportDialogProps {
  onClose: () => void;
}

const exportFormats: Array<{
  id: ExportFormat;
  name: string;
  description: string;
  icon: typeof FileJson;
  extension: string;
}> = [
  {
    id: 'json',
    name: 'JSON',
    description: 'Complete data export with documents, entities, and links',
    icon: FileJson,
    extension: '.json',
  },
  {
    id: 'graphml',
    name: 'GraphML',
    description: 'Graph format for Gephi, Cytoscape, and other visualization tools',
    icon: FileCode,
    extension: '.graphml',
  },
  {
    id: 'csv-entities',
    name: 'CSV (Entities)',
    description: 'Entity data in spreadsheet format',
    icon: FileSpreadsheet,
    extension: '.csv',
  },
  {
    id: 'csv-links',
    name: 'CSV (Links)',
    description: 'Link data in spreadsheet format',
    icon: FileSpreadsheet,
    extension: '.csv',
  },
  {
    id: 'embeddings',
    name: 'Embeddings Format',
    description: 'Optimized for vector databases and semantic search',
    icon: Database,
    extension: '.json',
  },
];

export function ExportDialog({ onClose }: ExportDialogProps) {
  const { documents, entities, links } = useDocumentStore();
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('json');
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      exportData(documents, entities, links, {
        format: selectedFormat,
      });
      setTimeout(() => {
        setExporting(false);
        onClose();
      }, 500);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
      setExporting(false);
    }
  };

  const selectedFormatInfo = exportFormats.find((f) => f.id === selectedFormat);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export Data
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Choose a format to export your knowledge graph
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-muted/20 rounded-lg border">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{documents.length}</div>
              <div className="text-xs text-muted-foreground">Documents</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{entities.length}</div>
              <div className="text-xs text-muted-foreground">Entities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{links.length}</div>
              <div className="text-xs text-muted-foreground">Links</div>
            </div>
          </div>

          {/* Format Selection */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Select Export Format</h3>
            <div className="space-y-2">
              {exportFormats.map((format) => {
                const Icon = format.icon;
                const isSelected = selectedFormat === format.id;

                return (
                  <button
                    key={format.id}
                    onClick={() => setSelectedFormat(format.id)}
                    className={cn(
                      'w-full text-left p-4 rounded-lg border-2 transition-all',
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          'p-2 rounded-lg',
                          isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{format.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {format.extension}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {format.description}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground">
                          <span className="text-xs">✓</span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preview Info */}
          {selectedFormatInfo && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                Export Details
              </h4>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                This will download a <strong>{selectedFormatInfo.extension}</strong> file with{' '}
                {selectedFormat === 'json' && 'all documents, entities, and links'}
                {selectedFormat === 'graphml' && 'entities and links in GraphML format'}
                {selectedFormat === 'csv-entities' && 'all entity data'}
                {selectedFormat === 'csv-links' && 'all link data'}
                {selectedFormat === 'embeddings' && 'entity data optimized for embeddings'}
                .
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-muted/20 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className={cn(
              'px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all',
              exporting
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            )}
          >
            <Download className="h-4 w-4" />
            {exporting ? 'Exporting...' : 'Export'}
          </button>
        </div>
      </div>
    </div>
  );
}

