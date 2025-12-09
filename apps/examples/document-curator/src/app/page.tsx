'use client';

import { useEffect } from 'react';
import { useDocumentStore } from '@/lib/document-store';

export default function DocumentCuratorPage() {
  const {
    documents,
    entities,
    links,
    loadSampleData,
  } = useDocumentStore();

  useEffect(() => {
    // Load sample data if store is empty
    if (documents.length === 0) {
      loadSampleData();
    }
  }, [documents.length, loadSampleData]);

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Document Curator</h1>
            <p className="text-sm text-muted-foreground">
              AI-assisted knowledge extraction from documents
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {documents.length} documents • {entities.length} entities • {links.length} links
            </span>
          </div>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center space-y-4 max-w-2xl px-4">
            <h2 className="text-4xl font-bold">🎉 Document Curator Initialized!</h2>
            <p className="text-lg text-muted-foreground">
              The foundation is complete with configuration, types, and state management.
            </p>
            
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="rounded-lg border p-4 bg-card">
                <div className="text-3xl font-bold text-blue-500">{documents.length}</div>
                <div className="text-sm text-muted-foreground">Sample Documents</div>
              </div>
              <div className="rounded-lg border p-4 bg-card">
                <div className="text-3xl font-bold text-purple-500">{entities.length}</div>
                <div className="text-sm text-muted-foreground">Extracted Entities</div>
              </div>
              <div className="rounded-lg border p-4 bg-card">
                <div className="text-3xl font-bold text-green-500">{links.length}</div>
                <div className="text-sm text-muted-foreground">Entity Links</div>
              </div>
            </div>

            <div className="mt-8 p-6 rounded-lg bg-muted text-left space-y-2">
              <h3 className="font-semibold">✅ Completed Phases:</h3>
              <ul className="text-sm space-y-1 ml-4 list-disc">
                <li>Phase 1: Project setup & configuration</li>
                <li>Phase 2: TypeScript types (326 lines)</li>
                <li>Phase 3: Zustand state management (~650 lines)</li>
              </ul>
              <h3 className="font-semibold mt-4">🚧 Next Steps:</h3>
              <ul className="text-sm space-y-1 ml-4 list-disc">
                <li>Phase 4: Document management UI components</li>
                <li>Phase 5: AI entity extraction backend</li>
                <li>Phase 6: Entity review & correction UI</li>
                <li>Phase 7: Entity linking system</li>
                <li>Phase 8: Knowledge graph visualization</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

