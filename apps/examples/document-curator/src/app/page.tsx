'use client';

import { useEffect, useState } from 'react';
import { useDocumentStore } from '@/lib/document-store';
import { DocumentList } from '@/components/documents/DocumentList';
import { DocumentFilters } from '@/components/documents/DocumentFilters';
import { DocumentUpload } from '@/components/documents/DocumentUpload';
import { EntityList } from '@/components/entities/EntityList';
import { EntityFilters } from '@/components/entities/EntityFilters';
import { KnowledgeGraph } from '@/components/graph/KnowledgeGraph';
import { ExportDialog } from '@/components/export/ExportDialog';
import { 
  FileText, 
  Users, 
  Link as LinkIcon, 
  Grid3x3, 
  List,
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  X,
  Network,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DocumentCuratorPage() {
  const {
    documents,
    entities,
    links,
    loadSampleData,
    viewMode,
    setViewMode,
    sidebarOpen,
    toggleSidebar,
  } = useDocumentStore();

  const [activeTab, setActiveTab] = useState<'documents' | 'entities' | 'graph'>('documents');
  const [showUpload, setShowUpload] = useState(false);
  const [showExport, setShowExport] = useState(false);

  useEffect(() => {
    // Load sample data if store is empty
    if (documents.length === 0) {
      loadSampleData();
    }
  }, [documents.length, loadSampleData]);

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Document Curator</h1>
            <p className="text-sm text-muted-foreground">
              AI-assisted knowledge extraction from documents
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                <span className="font-medium">{documents.length}</span>
                <span className="text-muted-foreground">docs</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-500" />
                <span className="font-medium">{entities.length}</span>
                <span className="text-muted-foreground">entities</span>
              </div>
              <div className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-green-500" />
                <span className="font-medium">{links.length}</span>
                <span className="text-muted-foreground">links</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 border rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-1.5 rounded transition-colors',
                  viewMode === 'grid'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                )}
              >
                <Grid3x3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-1.5 rounded transition-colors',
                  viewMode === 'list'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                )}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowExport(true)}
                className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
              <button
                onClick={() => setShowUpload(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Upload Document
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="border-b px-6">
            <div className="flex gap-6">
              <button
                onClick={() => setActiveTab('documents')}
                className={cn(
                  'relative py-3 text-sm font-medium transition-colors',
                  activeTab === 'documents'
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Documents
                {activeTab === 'documents' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('entities')}
                className={cn(
                  'relative py-3 text-sm font-medium transition-colors',
                  activeTab === 'entities'
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Entities
                {activeTab === 'entities' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('graph')}
                className={cn(
                  'relative py-3 text-sm font-medium transition-colors',
                  activeTab === 'graph'
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Knowledge Graph
                {activeTab === 'graph' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className={cn(
            "flex-1 overflow-auto",
            activeTab === 'graph' ? '' : 'p-6'
          )}>
            {activeTab === 'documents' && <DocumentList />}
            {activeTab === 'entities' && <EntityList />}
            {activeTab === 'graph' && (
              <div className="h-full">
                <KnowledgeGraph />
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-80 border-l bg-muted/20 flex flex-col">
            <div className="p-4 border-b bg-background">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Details</h2>
                <button
                  onClick={toggleSidebar}
                  className="p-1 hover:bg-muted rounded transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <div className="space-y-4">
                {/* Filters */}
                <div className="rounded-lg border p-4 bg-background">
                  <div className="flex items-center gap-2 mb-3">
                    <Filter className="h-4 w-4" />
                    <h3 className="font-medium">Filters</h3>
                  </div>
                  {activeTab === 'documents' && <DocumentFilters />}
                  {activeTab === 'entities' && <EntityFilters />}
                </div>

                {/* Quick Stats */}
                <div className="rounded-lg border p-4 bg-background">
                  <h3 className="font-medium mb-2">Quick Stats</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Documents</span>
                      <span className="font-medium">{documents.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Entities</span>
                      <span className="font-medium">{entities.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Approved Entities</span>
                      <span className="font-medium">
                        {entities.filter(e => e.approved).length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Entity Links</span>
                      <span className="font-medium">{links.length}</span>
                    </div>
                  </div>
                </div>

                {/* Implementation Status */}
                <div className="rounded-lg border p-4 bg-background">
                  <h3 className="font-medium mb-2">Implementation Status</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-green-600">
                      <div className="h-2 w-2 rounded-full bg-green-600" />
                      <span>Phase 1-4: Complete</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="h-2 w-2 rounded-full bg-muted" />
                      <span>Phase 5-12: Planned</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!sidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 border-l border-t border-b rounded-l-lg bg-background hover:bg-muted transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Upload Document</h2>
              <button
                onClick={() => setShowUpload(false)}
                className="p-1 hover:bg-muted rounded transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <DocumentUpload />
          </div>
        </div>
      )}

      {/* Export Dialog */}
      {showExport && <ExportDialog onClose={() => setShowExport(false)} />}
    </div>
  );
}
