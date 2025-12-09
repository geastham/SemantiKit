'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, X, File, CheckCircle2, AlertCircle } from 'lucide-react';
import { useGraphStore } from '@/lib/graph-store';

interface UploadedFile {
  id: string;
  file: File;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

const ACCEPTED_FILE_TYPES = ['.pdf', '.docx', '.txt', '.md'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function DocumentUpload({ onClose }: { onClose: () => void }) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const addNode = useGraphStore((state) => state.addNode);

  const validateFile = (file: File): string | null => {
    // Check file type
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ACCEPTED_FILE_TYPES.includes(extension)) {
      return `Invalid file type. Accepted types: ${ACCEPTED_FILE_TYPES.join(', ')}`;
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`;
    }

    return null;
  };

  const processFile = useCallback(
    async (file: File) => {
      const fileId = `upload-${Date.now()}-${Math.random()}`;
      
      // Add file to list with uploading status
      setFiles((prev) => [
        ...prev,
        { id: fileId, file, status: 'uploading' },
      ]);

      // Validate file
      const error = validateFile(file);
      if (error) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId ? { ...f, status: 'error', error } : f
          )
        );
        return;
      }

      try {
        // Simulate upload delay (in real app, this would upload to a server)
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Get file type
        const extension = file.name.split('.').pop()?.toUpperCase() || 'TXT';

        // Create a Document node in the graph
        addNode({
          type: 'default',
          data: {
            label: file.name,
            type: 'Document',
            properties: {
              title: file.name,
              type: extension,
              size: `${(file.size / 1024).toFixed(2)} KB`,
              uploadedAt: new Date().toISOString(),
            },
          },
          position: {
            x: Math.random() * 400 + 100,
            y: Math.random() * 400 + 100,
          },
        });

        // Mark as success
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId ? { ...f, status: 'success' } : f
          )
        );
      } catch (err) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? { ...f, status: 'error', error: 'Upload failed' }
              : f
          )
        );
      }
    },
    [addNode]
  );

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;

      Array.from(fileList).forEach((file) => {
        processFile(file);
      });
    },
    [processFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
    },
    [handleFiles]
  );

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const successCount = files.filter((f) => f.status === 'success').length;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Upload Documents</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-secondary rounded transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Upload Area */}
        <div className="p-4">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
              isDragging
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <Upload
              size={48}
              className="mx-auto mb-4 text-muted-foreground"
            />
            <p className="text-sm font-medium mb-2">
              Drag and drop files here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Supported formats: {ACCEPTED_FILE_TYPES.join(', ')} (max{' '}
              {MAX_FILE_SIZE / 1024 / 1024}MB)
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition text-sm"
            >
              Choose Files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={ACCEPTED_FILE_TYPES.join(',')}
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <h3 className="text-sm font-semibold mb-2">
              Files ({successCount}/{files.length} uploaded)
            </h3>
            <div className="space-y-2">
              {files.map((uploadedFile) => (
                <div
                  key={uploadedFile.id}
                  className="flex items-center gap-3 p-3 bg-background border border-border rounded"
                >
                  <File size={20} className="text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {uploadedFile.file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(uploadedFile.file.size / 1024).toFixed(2)} KB
                    </p>
                    {uploadedFile.status === 'error' && uploadedFile.error && (
                      <p className="text-xs text-destructive mt-1">
                        {uploadedFile.error}
                      </p>
                    )}
                  </div>
                  {uploadedFile.status === 'uploading' && (
                    <div className="flex-shrink-0 w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  )}
                  {uploadedFile.status === 'success' && (
                    <CheckCircle2
                      size={20}
                      className="text-green-500 flex-shrink-0"
                    />
                  )}
                  {uploadedFile.status === 'error' && (
                    <AlertCircle
                      size={20}
                      className="text-destructive flex-shrink-0"
                    />
                  )}
                  <button
                    onClick={() => removeFile(uploadedFile.id)}
                    className="p-1 hover:bg-secondary rounded transition flex-shrink-0"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            {successCount > 0 &&
              `${successCount} document${successCount !== 1 ? 's' : ''} added to graph`}
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition text-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

