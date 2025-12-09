'use client';

import { useState } from 'react';
import { Entity, EntityType, ENTITY_TYPE_COLORS } from '@/types';
import { useDocumentStore } from '@/lib/document-store';
import { X, Save, Trash2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EntityBadge } from './EntityList';

interface EntityEditorProps {
  entity: Entity;
  onClose: () => void;
}

export function EntityEditor({ entity, onClose }: EntityEditorProps) {
  const { updateEntity, removeEntity, approveEntity } = useDocumentStore();
  const [formData, setFormData] = useState({
    text: entity.text,
    type: entity.type,
    confidence: entity.confidence,
    context: entity.metadata?.context || '',
  });
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    updateEntity(entity.id, {
      text: formData.text,
      type: formData.type,
      confidence: formData.confidence,
      metadata: {
        ...entity.metadata,
        context: formData.context,
        editedAt: new Date().toISOString(),
      },
    });
    
    // Approve after editing
    approveEntity(entity.id);
    onClose();
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this entity?')) {
      removeEntity(entity.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Edit Entity</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {/* Entity Text */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Entity Text
            </label>
            <input
              type="text"
              value={formData.text}
              onChange={(e) => handleChange('text', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter entity text..."
            />
          </div>

          {/* Entity Type */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Entity Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.values(EntityType).filter(t => t !== EntityType.Unknown).map((type) => {
                const isSelected = formData.type === type;
                const color = ENTITY_TYPE_COLORS[type];
                return (
                  <button
                    key={type}
                    onClick={() => handleChange('type', type)}
                    className={cn(
                      'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                      isSelected
                        ? 'ring-2 ring-offset-2'
                        : 'opacity-60 hover:opacity-100'
                    )}
                    style={{
                      backgroundColor: `${color}15`,
                      color: color,
                      ringColor: isSelected ? color : undefined,
                    }}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Confidence */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Confidence Score
              </span>
              <span className="text-primary font-semibold">
                {Math.round(formData.confidence * 100)}%
              </span>
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={formData.confidence}
              onChange={(e) => handleChange('confidence', parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Context */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Context
            </label>
            <textarea
              value={formData.context}
              onChange={(e) => handleChange('context', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Enter surrounding context..."
            />
          </div>

          {/* Original Data (Read-only) */}
          <div className="border-t pt-4 space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Original Data</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Original Type:</span>
                <div className="mt-1">
                  <EntityBadge type={entity.type} size="sm" />
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Original Confidence:</span>
                <p className="font-medium">{Math.round(entity.confidence * 100)}%</p>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Extracted At:</span>
                <p className="font-medium text-xs">
                  {entity.metadata?.extractedAt 
                    ? new Date(entity.metadata.extractedAt).toLocaleString()
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t bg-muted/20">
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                hasChanges
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              )}
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

