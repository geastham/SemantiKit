import { Node as FlowNode, Edge as FlowEdge } from 'reactflow';

// ============================================================================
// Entity Types
// ============================================================================

export enum EntityType {
  Person = 'Person',
  Organization = 'Organization',
  Location = 'Location',
  Date = 'Date',
  Concept = 'Concept',
  Product = 'Product',
  Event = 'Event',
  Metric = 'Metric',
  Treaty = 'Treaty',
  Unknown = 'Unknown',
}

export const ENTITY_TYPE_COLORS: Record<EntityType, string> = {
  [EntityType.Person]: '#3b82f6',
  [EntityType.Organization]: '#8b5cf6',
  [EntityType.Location]: '#10b981',
  [EntityType.Date]: '#f59e0b',
  [EntityType.Concept]: '#ec4899',
  [EntityType.Product]: '#06b6d4',
  [EntityType.Event]: '#ef4444',
  [EntityType.Metric]: '#84cc16',
  [EntityType.Treaty]: '#6366f1',
  [EntityType.Unknown]: '#6b7280',
};

export const ENTITY_TYPE_ICONS: Record<EntityType, string> = {
  [EntityType.Person]: 'user',
  [EntityType.Organization]: 'building-2',
  [EntityType.Location]: 'map-pin',
  [EntityType.Date]: 'calendar',
  [EntityType.Concept]: 'lightbulb',
  [EntityType.Product]: 'package',
  [EntityType.Event]: 'calendar-days',
  [EntityType.Metric]: 'trending-up',
  [EntityType.Treaty]: 'file-text',
  [EntityType.Unknown]: 'help-circle',
};

// ============================================================================
// Document Types
// ============================================================================

export enum DocumentStatus {
  Pending = 'pending',
  Processing = 'processing',
  Extracted = 'extracted',
  Reviewed = 'reviewed',
  Completed = 'completed',
  Failed = 'failed',
}

export enum DocumentFormat {
  PDF = 'pdf',
  DOCX = 'docx',
  TXT = 'txt',
  MD = 'md',
  HTML = 'html',
  Unknown = 'unknown',
}

export interface Document {
  id: string;
  filename: string;
  format: DocumentFormat;
  size: number;
  content?: string;
  uploadedAt: Date;
  processedAt?: Date;
  reviewedAt?: Date;
  status: DocumentStatus;
  tags: string[];
  metadata: {
    title?: string;
    author?: string;
    pageCount?: number;
    wordCount?: number;
  };
  error?: string;
}

// ============================================================================
// Entity Types
// ============================================================================

export interface Entity {
  id: string;
  text: string;
  type: EntityType;
  confidence: number;
  documentId: string;
  position: EntityPosition;
  approved: boolean;
  rejected: boolean;
  corrected: boolean;
  linkedTo?: string[];
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    context?: string;
    page?: number;
    paragraph?: number;
    sentence?: number;
  };
}

export interface EntityPosition {
  start: number;
  end: number;
  page?: number;
}

// ============================================================================
// Extraction Types
// ============================================================================

export interface ExtractionResult {
  documentId: string;
  entities: Entity[];
  status: 'success' | 'partial' | 'failed';
  timestamp: Date;
  duration?: number;
  model?: string;
  error?: string;
}

export interface ExtractionRequest {
  documentId: string;
  content: string;
  filename: string;
  format: DocumentFormat;
  options?: {
    entityTypes?: EntityType[];
    confidenceThreshold?: number;
    maxEntities?: number;
    includeContext?: boolean;
  };
}

// ============================================================================
// Entity Linking Types
// ============================================================================

export enum LinkType {
  SameEntity = 'same-entity',
  Related = 'related',
  PartOf = 'part-of',
  LocatedIn = 'located-in',
  WorksFor = 'works-for',
  Attended = 'attended',
  Created = 'created',
  Mentioned = 'mentioned',
  Custom = 'custom',
}

export interface EntityLink {
  id: string;
  sourceId: string;
  targetId: string;
  type: LinkType;
  confidence: number;
  approved: boolean;
  automatic: boolean;
  createdAt: Date;
  metadata?: {
    reason?: string;
    similarity?: number;
  };
}

export interface LinkSuggestion {
  sourceEntity: Entity;
  targetEntity: Entity;
  type: LinkType;
  confidence: number;
  reason: string;
  similarity: number;
}

// ============================================================================
// Graph Types (for visualization)
// ============================================================================

export interface EntityNode extends FlowNode {
  data: {
    entity: Entity;
    documentCount: number;
    linkCount: number;
  };
}

export interface EntityEdge extends FlowEdge {
  data: {
    link: EntityLink;
    label: string;
  };
}

// ============================================================================
// Store State Types
// ============================================================================

export interface DocumentStoreState {
  documents: Document[];
  entities: Entity[];
  links: EntityLink[];
  
  selectedDocumentId: string | null;
  selectedEntityIds: string[];
  
  documentFilters: {
    search: string;
    status: DocumentStatus[];
    format: DocumentFormat[];
    tags: string[];
  };
  entityFilters: {
    search: string;
    types: EntityType[];
    confidenceMin: number;
    showApproved: boolean;
    showRejected: boolean;
    documentId?: string;
  };
  
  viewMode: 'grid' | 'list';
  sidebarOpen: boolean;
  graphMode: 'document' | 'global';
  
  addDocument: (document: Omit<Document, 'id' | 'uploadedAt' | 'status'>) => string;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  removeDocument: (id: string) => void;
  setDocumentStatus: (id: string, status: DocumentStatus) => void;
  addDocumentTag: (id: string, tag: string) => void;
  removeDocumentTag: (id: string, tag: string) => void;
  
  addEntities: (entities: Omit<Entity, 'id' | 'createdAt' | 'updatedAt'>[]) => void;
  updateEntity: (id: string, updates: Partial<Entity>) => void;
  removeEntity: (id: string) => void;
  approveEntity: (id: string) => void;
  rejectEntity: (id: string) => void;
  approveAllEntities: (documentId?: string, minConfidence?: number) => void;
  
  addLink: (link: Omit<EntityLink, 'id' | 'createdAt'>) => void;
  updateLink: (id: string, updates: Partial<EntityLink>) => void;
  removeLink: (id: string) => void;
  approveLink: (id: string) => void;
  autoLinkEntities: (documentId?: string) => void;
  
  selectDocument: (id: string | null) => void;
  selectEntity: (id: string) => void;
  deselectEntity: (id: string) => void;
  clearEntitySelection: () => void;
  
  setDocumentFilter: (key: keyof DocumentStoreState['documentFilters'], value: any) => void;
  setEntityFilter: (key: keyof DocumentStoreState['entityFilters'], value: any) => void;
  resetFilters: () => void;
  
  setViewMode: (mode: 'grid' | 'list') => void;
  toggleSidebar: () => void;
  setGraphMode: (mode: 'document' | 'global') => void;
  
  loadSampleData: () => void;
  clearAll: () => void;
  exportData: () => string;
  importData: (json: string) => void;
}

// ============================================================================
// API Types
// ============================================================================

export interface ExtractEntitiesResponse {
  success: boolean;
  entities?: Entity[];
  error?: string;
  duration?: number;
}

export interface LinkEntitiesResponse {
  success: boolean;
  suggestions?: LinkSuggestion[];
  error?: string;
}

export interface GenerateEmbeddingsRequest {
  entities: string[];
}

export interface GenerateEmbeddingsResponse {
  success: boolean;
  embeddings?: Record<string, number[]>;
  error?: string;
}

// ============================================================================
// Export Types
// ============================================================================

export interface ExportFormat {
  format: 'json' | 'graphml' | 'csv';
  includeDocuments: boolean;
  includeEntities: boolean;
  includeLinks: boolean;
  filterApproved: boolean;
}

export interface KnowledgeGraphExport {
  version: string;
  exportedAt: Date;
  documents: Document[];
  entities: Entity[];
  links: EntityLink[];
  statistics: {
    documentCount: number;
    entityCount: number;
    linkCount: number;
    entityTypeBreakdown: Record<EntityType, number>;
  };
}

