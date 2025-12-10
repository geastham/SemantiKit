import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Document,
  Entity,
  EntityLink,
  DocumentStoreState,
  DocumentStatus,
  DocumentFormat,
  EntityType,
  LinkType,
} from '@/types';

export const useDocumentStore = create<DocumentStoreState>()(
  persist(
    (set, get) => ({
      // Initial State
      documents: [],
      entities: [],
      links: [],
      
      selectedDocumentId: null,
      selectedEntityIds: [],
      
      documentFilters: {
        search: '',
        status: [],
        format: [],
        tags: [],
      },
      
      entityFilters: {
        search: '',
        types: [],
        confidenceMin: 0,
        showApproved: true,
        showRejected: false,
        documentId: undefined,
      },
      
      viewMode: 'grid',
      sidebarOpen: true,
      graphMode: 'document',
      
      // Document Actions
      addDocument: (documentData) => {
        const newDocument: Document = {
          id: \`doc-\${Date.now()}-\${Math.random().toString(36).substr(2, 9)}\`,
          ...documentData,
          uploadedAt: new Date(),
          status: DocumentStatus.Pending,
        };
        
        set((state) => ({
          documents: [...state.documents, newDocument],
        }));
        
        return newDocument.id;
      },
      
      updateDocument: (id, updates) => {
        set((state) => ({
          documents: state.documents.map((doc) =>
            doc.id === id ? { ...doc, ...updates } : doc
          ),
        }));
      },
      
      removeDocument: (id) => {
        set((state) => ({
          documents: state.documents.filter((doc) => doc.id !== id),
          entities: state.entities.filter((entity) => entity.documentId !== id),
          selectedDocumentId:
            state.selectedDocumentId === id ? null : state.selectedDocumentId,
        }));
      },
      
      setDocumentStatus: (id, status) => {
        get().updateDocument(id, { status });
      },
      
      addDocumentTag: (id, tag) => {
        const document = get().documents.find((doc) => doc.id === id);
        if (document && !document.tags.includes(tag)) {
          get().updateDocument(id, {
            tags: [...document.tags, tag],
          });
        }
      },
      
      removeDocumentTag: (id, tag) => {
        const document = get().documents.find((doc) => doc.id === id);
        if (document) {
          get().updateDocument(id, {
            tags: document.tags.filter((t) => t !== tag),
          });
        }
      },
      
      // Entity Actions
      addEntities: (entitiesData) => {
        const now = new Date();
        const newEntities: Entity[] = entitiesData.map((entityData) => ({
          id: \`entity-\${Date.now()}-\${Math.random().toString(36).substr(2, 9)}\`,
          ...entityData,
          createdAt: now,
          updatedAt: now,
        }));
        
        set((state) => ({
          entities: [...state.entities, ...newEntities],
        }));
      },
      
      updateEntity: (id, updates) => {
        set((state) => ({
          entities: state.entities.map((entity) =>
            entity.id === id
              ? { ...entity, ...updates, updatedAt: new Date() }
              : entity
          ),
        }));
      },
      
      removeEntity: (id) => {
        set((state) => ({
          entities: state.entities.filter((entity) => entity.id !== id),
          links: state.links.filter(
            (link) => link.sourceId !== id && link.targetId !== id
          ),
          selectedEntityIds: state.selectedEntityIds.filter(
            (selectedId) => selectedId !== id
          ),
        }));
      },
      
      approveEntity: (id) => {
        get().updateEntity(id, { approved: true, rejected: false });
      },
      
      rejectEntity: (id) => {
        get().updateEntity(id, { approved: false, rejected: true });
      },
      
      approveAllEntities: (documentId, minConfidence = 0.7) => {
        set((state) => ({
          entities: state.entities.map((entity) => {
            const shouldApprove =
              (!documentId || entity.documentId === documentId) &&
              entity.confidence >= minConfidence &&
              !entity.rejected;
            
            return shouldApprove
              ? { ...entity, approved: true, updatedAt: new Date() }
              : entity;
          }),
        }));
      },
      
      // Link Actions
      addLink: (linkData) => {
        const newLink: EntityLink = {
          id: \`link-\${Date.now()}-\${Math.random().toString(36).substr(2, 9)}\`,
          ...linkData,
          createdAt: new Date(),
        };
        
        set((state) => ({
          links: [...state.links, newLink],
        }));
      },
      
      updateLink: (id, updates) => {
        set((state) => ({
          links: state.links.map((link) =>
            link.id === id ? { ...link, ...updates } : link
          ),
        }));
      },
      
      removeLink: (id) => {
        set((state) => ({
          links: state.links.filter((link) => link.id !== id),
        }));
      },
      
      approveLink: (id) => {
        get().updateLink(id, { approved: true });
      },
      
      autoLinkEntities: (documentId) => {
        const state = get();
        const entities = documentId
          ? state.entities.filter((e) => e.documentId === documentId)
          : state.entities;
        
        for (let i = 0; i < entities.length; i++) {
          for (let j = i + 1; j < entities.length; j++) {
            const entity1 = entities[i];
            const entity2 = entities[j];
            
            if (
              entity1.text.toLowerCase() === entity2.text.toLowerCase() &&
              entity1.type === entity2.type &&
              !state.links.some(
                (link) =>
                  (link.sourceId === entity1.id && link.targetId === entity2.id) ||
                  (link.sourceId === entity2.id && link.targetId === entity1.id)
              )
            ) {
              state.addLink({
                sourceId: entity1.id,
                targetId: entity2.id,
                type: LinkType.SameEntity,
                confidence: 0.95,
                approved: false,
                automatic: true,
                metadata: {
                  reason: 'Exact text match',
                  similarity: 1.0,
                },
              });
            }
          }
        }
      },
      
      // Selection Actions
      selectDocument: (id) => {
        set({ selectedDocumentId: id });
      },
      
      selectEntity: (id) => {
        set((state) => ({
          selectedEntityIds: state.selectedEntityIds.includes(id)
            ? state.selectedEntityIds
            : [...state.selectedEntityIds, id],
        }));
      },
      
      deselectEntity: (id) => {
        set((state) => ({
          selectedEntityIds: state.selectedEntityIds.filter(
            (selectedId) => selectedId !== id
          ),
        }));
      },
      
      clearEntitySelection: () => {
        set({ selectedEntityIds: [] });
      },
      
      // Filter Actions
      setDocumentFilter: (key, value) => {
        set((state) => ({
          documentFilters: {
            ...state.documentFilters,
            [key]: value,
          },
        }));
      },
      
      setEntityFilter: (key, value) => {
        set((state) => ({
          entityFilters: {
            ...state.entityFilters,
            [key]: value,
          },
        }));
      },
      
      resetFilters: () => {
        set({
          documentFilters: {
            search: '',
            status: [],
            format: [],
            tags: [],
          },
          entityFilters: {
            search: '',
            types: [],
            confidenceMin: 0,
            showApproved: true,
            showRejected: false,
            documentId: undefined,
          },
        });
      },
      
      // UI Actions
      setViewMode: (mode) => {
        set({ viewMode: mode });
      },
      
      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },
      
      setGraphMode: (mode) => {
        set({ graphMode: mode });
      },
      
      // Data Actions - loadSampleData
      loadSampleData: () => {
        const sampleDocuments: Document[] = [
          {
            id: 'doc-sample-1',
            filename: 'climate-report-2024.pdf',
            format: DocumentFormat.PDF,
            size: 2048576,
            uploadedAt: new Date('2024-12-01'),
            processedAt: new Date('2024-12-01'),
            status: DocumentStatus.Completed,
            tags: ['climate', 'policy', 'important'],
            metadata: {
              title: 'Global Climate Report 2024',
              author: 'UN Climate Council',
              pageCount: 45,
              wordCount: 12000,
            },
          },
          {
            id: 'doc-sample-2',
            filename: 'tech-strategy.docx',
            format: DocumentFormat.DOCX,
            size: 512000,
            uploadedAt: new Date('2024-12-05'),
            processedAt: new Date('2024-12-05'),
            status: DocumentStatus.Extracted,
            tags: ['tech', 'strategy'],
            metadata: {
              title: 'Technology Strategy 2025',
              author: 'Tech Innovations Inc.',
              wordCount: 5000,
            },
          },
          {
            id: 'doc-sample-3',
            filename: 'meeting-notes.txt',
            format: DocumentFormat.TXT,
            size: 8192,
            uploadedAt: new Date('2024-12-08'),
            status: DocumentStatus.Pending,
            tags: ['meeting', 'notes'],
            metadata: {
              wordCount: 800,
            },
          },
        ];
        
        const sampleEntities: Entity[] = [
          {
            id: 'entity-1',
            text: 'Paris Agreement',
            type: EntityType.Treaty,
            confidence: 0.98,
            documentId: 'doc-sample-1',
            position: { start: 120, end: 135 },
            approved: true,
            rejected: false,
            corrected: false,
            createdAt: new Date('2024-12-01'),
            updatedAt: new Date('2024-12-01'),
            metadata: {
              context: 'The Paris Agreement was signed in 2015...',
              page: 3,
            },
          },
          {
            id: 'entity-2',
            text: 'United Nations',
            type: EntityType.Organization,
            confidence: 0.95,
            documentId: 'doc-sample-1',
            position: { start: 45, end: 59 },
            approved: true,
            rejected: false,
            corrected: false,
            createdAt: new Date('2024-12-01'),
            updatedAt: new Date('2024-12-01'),
            metadata: {
              context: 'The United Nations Climate Council reports...',
              page: 1,
            },
          },
          {
            id: 'entity-3',
            text: 'Climate Change',
            type: EntityType.Concept,
            confidence: 0.92,
            documentId: 'doc-sample-1',
            position: { start: 200, end: 214 },
            approved: true,
            rejected: false,
            corrected: false,
            createdAt: new Date('2024-12-01'),
            updatedAt: new Date('2024-12-01'),
          },
          {
            id: 'entity-4',
            text: 'Carbon Emissions',
            type: EntityType.Metric,
            confidence: 0.88,
            documentId: 'doc-sample-1',
            position: { start: 350, end: 366 },
            approved: false,
            rejected: false,
            corrected: false,
            createdAt: new Date('2024-12-01'),
            updatedAt: new Date('2024-12-01'),
          },
          {
            id: 'entity-5',
            text: 'Tech Innovations Inc.',
            type: EntityType.Organization,
            confidence: 0.96,
            documentId: 'doc-sample-2',
            position: { start: 10, end: 32 },
            approved: false,
            rejected: false,
            corrected: false,
            createdAt: new Date('2024-12-05'),
            updatedAt: new Date('2024-12-05'),
          },
        ];
        
        const sampleLinks: EntityLink[] = [
          {
            id: 'link-1',
            sourceId: 'entity-1',
            targetId: 'entity-2',
            type: LinkType.Related,
            confidence: 0.9,
            approved: true,
            automatic: true,
            createdAt: new Date('2024-12-01'),
            metadata: {
              reason: 'Both mentioned in same document',
              similarity: 0.85,
            },
          },
        ];
        
        set({
          documents: sampleDocuments,
          entities: sampleEntities,
          links: sampleLinks,
        });
      },
      
      clearAll: () => {
        set({
          documents: [],
          entities: [],
          links: [],
          selectedDocumentId: null,
          selectedEntityIds: [],
        });
      },
      
      exportData: () => {
        const state = get();
        const exportData = {
          version: '1.0.0',
          exportedAt: new Date().toISOString(),
          documents: state.documents,
          entities: state.entities,
          links: state.links,
        };
        return JSON.stringify(exportData, null, 2);
      },
      
      importData: (json) => {
        try {
          const data = JSON.parse(json);
          set({
            documents: data.documents || [],
            entities: data.entities || [],
            links: data.links || [],
          });
        } catch (error) {
          console.error('Failed to import data:', error);
        }
      },
    }),
    {
      name: 'document-curator-storage',
      partialize: (state) => ({
        documents: state.documents,
        entities: state.entities,
        links: state.links,
        viewMode: state.viewMode,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);

// Selector Hooks
export const useFilteredDocuments = () => {
  return useDocumentStore((state) => {
    let filtered = state.documents;
    
    if (state.documentFilters.search) {
      const search = state.documentFilters.search.toLowerCase();
      filtered = filtered.filter(
        (doc) =>
          doc.filename.toLowerCase().includes(search) ||
          doc.metadata.title?.toLowerCase().includes(search) ||
          doc.tags.some((tag) => tag.toLowerCase().includes(search))
      );
    }
    
    if (state.documentFilters.status.length > 0) {
      filtered = filtered.filter((doc) =>
        state.documentFilters.status.includes(doc.status)
      );
    }
    
    if (state.documentFilters.format.length > 0) {
      filtered = filtered.filter((doc) =>
        state.documentFilters.format.includes(doc.format)
      );
    }
    
    if (state.documentFilters.tags.length > 0) {
      filtered = filtered.filter((doc) =>
        state.documentFilters.tags.some((tag) => doc.tags.includes(tag))
      );
    }
    
    return filtered;
  });
};

export const useFilteredEntities = () => {
  return useDocumentStore((state) => {
    let filtered = state.entities;
    
    if (state.entityFilters.documentId) {
      filtered = filtered.filter(
        (entity) => entity.documentId === state.entityFilters.documentId
      );
    }
    
    if (state.entityFilters.search) {
      const search = state.entityFilters.search.toLowerCase();
      filtered = filtered.filter((entity) =>
        entity.text.toLowerCase().includes(search)
      );
    }
    
    if (state.entityFilters.types.length > 0) {
      filtered = filtered.filter((entity) =>
        state.entityFilters.types.includes(entity.type)
      );
    }
    
    filtered = filtered.filter(
      (entity) => entity.confidence >= state.entityFilters.confidenceMin
    );
    
    if (!state.entityFilters.showApproved) {
      filtered = filtered.filter((entity) => !entity.approved);
    }
    if (!state.entityFilters.showRejected) {
      filtered = filtered.filter((entity) => !entity.rejected);
    }
    
    return filtered;
  });
};
