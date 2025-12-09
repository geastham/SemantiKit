'use client';

import { useState } from 'react';
import { useDocumentStore, useFilteredEntities } from '@/lib/document-store';
import { Entity, EntityType, ENTITY_TYPE_COLORS } from '@/types';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, Circle, Sparkles, Edit2 } from 'lucide-react';
import { EntityEditor } from './EntityEditor';

interface EntityBadgeProps {
  type: EntityType;
  size?: 'sm' | 'md';
}

export function EntityBadge({ type, size = 'md' }: EntityBadgeProps) {
  const color = ENTITY_TYPE_COLORS[type];
  
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      )}
      style={{
        backgroundColor: `${color}15`,
        color: color,
      }}
    >
      {type}
    </div>
  );
}

interface EntityCardProps {
  entity: Entity;
  isSelected: boolean;
  onSelect: () => void;
  onApprove: () => void;
  onReject: () => void;
  onEdit: () => void;
}

function EntityCard({ entity, isSelected, onSelect, onApprove, onReject, onEdit }: EntityCardProps) {
  const document = useDocumentStore((state) =>
    state.documents.find((d) => d.id === entity.documentId)
  );

  return (
    <div
      className={cn(
        'rounded-lg border p-3 transition-all',
        isSelected ? 'border-primary bg-primary/5' : 'border-border bg-card'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div 
          className="flex-1 cursor-pointer"
          onClick={onSelect}
        >
          <div className="flex items-start gap-2 mb-2">
            <EntityBadge type={entity.type} size="sm" />
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Sparkles className="h-3 w-3" />
              {Math.round(entity.confidence * 100)}%
            </div>
          </div>
          
          <p className="font-medium text-sm mb-1">{entity.text}</p>
          
          {entity.metadata?.context && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {entity.metadata.context}
            </p>
          )}
          
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            {document && (
              <span className="truncate">{document.filename}</span>
            )}
            {entity.metadata?.page && (
              <span>Page {entity.metadata.page}</span>
            )}
          </div>
        </div>
        
        <div className="flex flex-col gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-1 rounded hover:bg-blue-100 text-blue-600 transition-colors"
            title="Edit"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          {entity.approved && (
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          )}
          {entity.rejected && (
            <div className="flex items-center gap-1 text-red-600">
              <XCircle className="h-4 w-4" />
            </div>
          )}
          {!entity.approved && !entity.rejected && (
            <div className="flex gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onApprove();
                }}
                className="p-1 rounded hover:bg-green-100 text-green-600 transition-colors"
                title="Approve"
              >
                <CheckCircle2 className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReject();
                }}
                className="p-1 rounded hover:bg-red-100 text-red-600 transition-colors"
                title="Reject"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function EntityList() {
  const filteredEntities = useFilteredEntities();
  const {
    selectedEntityIds,
    selectEntity,
    deselectEntity,
    approveEntity,
    rejectEntity,
  } = useDocumentStore();
  const [editingEntity, setEditingEntity] = useState<Entity | null>(null);

  if (filteredEntities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <Circle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No entities found</h3>
        <p className="text-sm text-muted-foreground">
          Extract entities from a document to get started
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {filteredEntities.map((entity) => (
          <EntityCard
            key={entity.id}
            entity={entity}
            isSelected={selectedEntityIds.includes(entity.id)}
            onSelect={() => {
              if (selectedEntityIds.includes(entity.id)) {
                deselectEntity(entity.id);
              } else {
                selectEntity(entity.id);
              }
            }}
            onApprove={() => approveEntity(entity.id)}
            onReject={() => rejectEntity(entity.id)}
            onEdit={() => setEditingEntity(entity)}
          />
        ))}
      </div>

      {editingEntity && (
        <EntityEditor
          entity={editingEntity}
          onClose={() => setEditingEntity(null)}
        />
      )}
    </>
  );
}
