'use client';

import { useState, useCallback } from 'react';
import { useDocumentStore } from '@/lib/document-store';
import { DocumentFormat, DocumentStatus } from '@/types';
import { mockExtractEntities, extractTextFromFile } from '@/lib/extraction';
import { Upload, FileText, X, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadState {
  file: File | null;
  uploading: boolean;
  extracting: boolean;
  progress: number;
  error: string | null;
}

export function DocumentUpload() {
  const { addDocument, addEntities, setDocumentStatus, autoLinkEntities } = useDocumentStore();
  const [state, setState] = useState<UploadState>({
    file: null,
    uploading: false,
    extracting: false,
    progress: 0,
    error: null,
  });

  const getDocumentFormat = (filename: string): DocumentFormat => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf':
        return DocumentFormat.PDF;
      case 'docx':
        return DocumentFormat.DOCX;
      case 'txt':
        return DocumentFormat.TXT;
      case 'md':
        return DocumentFormat.MD;
      case 'html':
        return DocumentFormat.HTML;
      default:
        return DocumentFormat.Unknown;
    }
  };

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setState((prev) => ({ ...prev, file, error: null }));
    }
  }, []);

  const handleUpload = async () => {
    if (!state.file) return;

    const documentId = `doc-${Date.now()}`;
    
    try {
      setState((prev) => ({ ...prev, uploading: true, progress: 0, error: null }));

      // Create document
      const document = {
        id: documentId,
        filename: state.file.name,
        format: getDocumentFormat(state.file.name),
        size: state.file.size,
        uploadedAt: new Date().toISOString(),
        status: DocumentStatus.Processing,
        tags: [],
        metadata: {
          title: state.file.name.replace(/\.[^/.]+$/, ''),
          author: '',
          pageCount: 0,
          wordCount: 0,
        },
      };

      addDocument(document);
      setState((prev) => ({ ...prev, progress: 30 }));

      // Extract text
      const text = await extractTextFromFile(state.file);
      setState((prev) => ({ ...prev, progress: 50, extracting: true }));

      // Extract entities using mock extraction (use real extraction if API key is available)
      const result = await mockExtractEntities(text, documentId);
      
      // Add entities to store
      addEntities(result.entities);
      setState((prev) => ({ ...prev, progress: 80 }));

      // Auto-link entities
      autoLinkEntities();
      
      // Update document status
      setDocumentStatus(documentId, DocumentStatus.Extracted);
      setState((prev) => ({ ...prev, progress: 100 }));

      // Reset after delay
      setTimeout(() => {
        setState({
          file: null,
          uploading: false,
          extracting: false,
          progress: 0,
          error: null,
        });
      }, 1500);

    } catch (error) {
      console.error('Upload failed:', error);
      setState((prev) => ({
        ...prev,
        uploading: false,
        extracting: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      }));
      setDocumentStatus(documentId, DocumentStatus.Failed, 
        error instanceof Error ? error.message : 'Upload failed'
      );
    }
  };

  const handleCancel = () => {
    setState({
      file: null,
      uploading: false,
      extracting: false,
      progress: 0,
      error: null,
    });
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      {!state.file && (
        <label
          className={cn(
            'flex flex-col items-center justify-center',
            'border-2 border-dashed rounded-lg p-8',
            'cursor-pointer transition-colors',
            'hover:border-primary hover:bg-primary/5'
          )}
        >
          <Upload className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="text-sm font-medium mb-1">Upload a document</p>
          <p className="text-xs text-muted-foreground mb-4">
            PDF, DOCX, TXT, or MD (max 10MB)
          </p>
          <input
            type="file"
            accept=".pdf,.docx,.txt,.md,.html"
            onChange={handleFileSelect}
            className="hidden"
            disabled={state.uploading}
          />
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            Choose File
          </button>
        </label>
      )}

      {/* File Selected */}
      {state.file && !state.uploading && (
        <div className="border rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-muted p-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{state.file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(state.file.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <button
              onClick={handleCancel}
              className="p-1 rounded hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          {state.error && (
            <div className="mt-3 flex items-start gap-2 p-2 rounded bg-red-50 text-red-700 text-xs">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{state.error}</span>
            </div>
          )}

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleUpload}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Upload & Extract
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Uploading Progress */}
      {state.uploading && (
        <div className="border rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium">
                {state.extracting ? 'Extracting entities...' : 'Uploading document...'}
              </p>
              <p className="text-xs text-muted-foreground">{state.file?.name}</p>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{state.progress}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${state.progress}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

