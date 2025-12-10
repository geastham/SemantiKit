'use client';

import { useDocumentStore, useFilteredDocuments } from '@/lib/document-store';
import { Document, DocumentStatus } from '@/types';
import { formatBytes, formatDate, cn } from '@/lib/utils';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Loader2,
  Tag,
  Calendar
} from 'lucide-react';

const statusConfig = {
  [DocumentStatus.Pending]: {
    icon: Clock,
    label: 'Pending',
    className: 'text-gray-500 bg-gray-100',
  },
  [DocumentStatus.Processing]: {
    icon: Loader2,
    label: 'Processing',
    className: 'text-blue-500 bg-blue-100 animate-spin',
  },
  [DocumentStatus.Extracted]: {
    icon: CheckCircle2,
    label: 'Extracted',
    className: 'text-green-500 bg-green-100',
  },
  [DocumentStatus.Reviewed]: {
    icon: CheckCircle2,
    label: 'Reviewed',
    className: 'text-emerald-500 bg-emerald-100',
  },
  [DocumentStatus.Completed]: {
    icon: CheckCircle2,
    label: 'Completed',
    className: 'text-green-600 bg-green-100',
  },
  [DocumentStatus.Failed]: {
    icon: XCircle,
    label: 'Failed',
    className: 'text-red-500 bg-red-100',
  },
};

interface DocumentCardProps {
  document: Document;
  isSelected: boolean;
  onSelect: () => void;
}

function DocumentCard({ document, isSelected, onSelect }: DocumentCardProps) {
  const config = statusConfig[document.status];
  const StatusIcon = config.icon;
  const entities = useDocumentStore((state) => 
    state.entities.filter((e) => e.documentId === document.id)
  );

  return (
    <div
      onClick={onSelect}
      className={cn(
        'rounded-lg border p-4 cursor-pointer transition-all hover:shadow-md',
        isSelected ? 'border-primary bg-primary/5' : 'border-border bg-card'
      )}
    >
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-muted p-2">
          <FileText className="h-5 w-5 text-muted-foreground" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate">
            {document.metadata.title || document.filename}
          </h3>
          <p className="text-xs text-muted-foreground truncate">
            {document.filename}
          </p>
          
          <div className="flex items-center gap-2 mt-2">
            <div className={cn('flex items-center gap-1 px-2 py-0.5 rounded-full text-xs', config.className)}>
              <StatusIcon className="h-3 w-3" />
              <span>{config.label}</span>
            </div>
            
            {entities.length > 0 && (
              <div className="text-xs text-muted-foreground">
                {entities.length} entities
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(document.uploadedAt)}
            </div>
            <div>{formatBytes(document.size)}</div>
            {document.metadata.pageCount && (
              <div>{document.metadata.pageCount} pages</div>
            )}
          </div>
          
          {document.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {document.tags.map((tag) => (
                <div
                  key={tag}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-xs"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {document.error && (
        <div className="mt-3 flex items-start gap-2 p-2 rounded bg-red-50 text-red-700 text-xs">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>{document.error}</span>
        </div>
      )}
    </div>
  );
}

export function DocumentList() {
  const filteredDocuments = useFilteredDocuments();
  const { selectedDocumentId, selectDocument, viewMode } = useDocumentStore();

  if (filteredDocuments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No documents found</h3>
        <p className="text-sm text-muted-foreground">
          Upload a document to get started
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'gap-4',
        viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
          : 'flex flex-col'
      )}
    >
      {filteredDocuments.map((document) => (
        <DocumentCard
          key={document.id}
          document={document}
          isSelected={selectedDocumentId === document.id}
          onSelect={() => selectDocument(document.id)}
        />
      ))}
    </div>
  );
}

