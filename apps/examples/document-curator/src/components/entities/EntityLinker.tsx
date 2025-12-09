'use client';

import { useState, useEffect } from 'react';
import { Entity, EntityLink } from '@/types';
import { useDocumentStore } from '@/lib/document-store';
import { findPotentialLinks, calculateLinkStrength } from '@/lib/linking';
import { X, Link2, Sparkles, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EntityBadge } from './EntityList';

interface EntityLinkerProps {
  entity: Entity;
  onClose: () => void;
}

export function EntityLinker({ entity, onClose }: EntityLinkerProps) {
  const { entities, links, addLink, removeLink } = useDocumentStore();
  const [potentialLinks, setPotentialLinks] = useState<
    Array<{ entity: Entity; similarity: number; contextScore: number; totalScore: number }>
  >([]);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [linkType, setLinkType] = useState<'similar' | 'related' | 'references' | 'mentions'>('similar');

  useEffect(() => {
    // Find potential links when component mounts
    const results = findPotentialLinks(entity, entities, {
      textSimilarityThreshold: 0.6,
      contextSimilarityThreshold: 0.2,
      maxResults: 20,
    });
    setPotentialLinks(results);
  }, [entity, entities]);

  const existingLinks = links.filter(
    (link) => link.sourceEntityId === entity.id || link.targetEntityId === entity.id
  );

  const isLinked = (targetEntityId: string): boolean => {
    return existingLinks.some(
      (link) =>
        (link.sourceEntityId === entity.id && link.targetEntityId === targetEntityId) ||
        (link.targetEntityId === entity.id && link.sourceEntityId === targetEntityId)
    );
  };

  const handleCreateLink = () => {
    if (!selectedEntityId) return;

    const targetEntity = entities.find((e) => e.id === selectedEntityId);
    if (!targetEntity) return;

    const confidence = calculateLinkStrength(entity, targetEntity, entities);

    const newLink: EntityLink = {
      id: `link-${Date.now()}`,
      sourceEntityId: entity.id,
      targetEntityId: selectedEntityId,
      type: linkType,
      confidence,
      metadata: {
        createdAt: new Date().toISOString(),
        automatic: false,
      },
    };

    addLink(newLink);
    setSelectedEntityId(null);
  };

  const handleRemoveLink = (linkId: string) => {
    if (confirm('Remove this link?')) {
      removeLink(linkId);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              Link Entity
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Connect "{entity.text}" to related entities
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
        <div className="flex-1 overflow-auto p-4 space-y-6">
          {/* Current Entity */}
          <div className="border rounded-lg p-4 bg-muted/20">
            <label className="text-xs font-medium text-muted-foreground uppercase">
              Current Entity
            </label>
            <div className="flex items-center gap-3 mt-2">
              <EntityBadge type={entity.type} />
              <div>
                <p className="font-medium">{entity.text}</p>
                <p className="text-sm text-muted-foreground">
                  Confidence: {Math.round(entity.confidence * 100)}%
                </p>
              </div>
            </div>
          </div>

          {/* Existing Links */}
          {existingLinks.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                Existing Links ({existingLinks.length})
              </h3>
              <div className="space-y-2">
                {existingLinks.map((link) => {
                  const linkedEntityId =
                    link.sourceEntityId === entity.id
                      ? link.targetEntityId
                      : link.sourceEntityId;
                  const linkedEntity = entities.find((e) => e.id === linkedEntityId);

                  if (!linkedEntity) return null;

                  return (
                    <div
                      key={link.id}
                      className="border rounded-lg p-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <EntityBadge type={linkedEntity.type} size="sm" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {linkedEntity.text}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="capitalize">{link.type}</span>
                            <span>•</span>
                            <span>{Math.round(link.confidence * 100)}% confidence</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveLink(link.id)}
                        className="p-1 rounded hover:bg-red-100 text-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Potential Links */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Suggested Links ({potentialLinks.length})
            </h3>

            {potentialLinks.length === 0 ? (
              <div className="border rounded-lg p-8 text-center">
                <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No similar entities found
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {potentialLinks.map((result) => {
                  const alreadyLinked = isLinked(result.entity.id);
                  const isSelected = selectedEntityId === result.entity.id;

                  return (
                    <div
                      key={result.entity.id}
                      onClick={() => {
                        if (!alreadyLinked) {
                          setSelectedEntityId(
                            isSelected ? null : result.entity.id
                          );
                        }
                      }}
                      className={cn(
                        'border rounded-lg p-3 transition-all cursor-pointer',
                        alreadyLinked && 'opacity-50 cursor-not-allowed bg-muted/20',
                        !alreadyLinked && 'hover:bg-muted/50',
                        isSelected && 'ring-2 ring-primary bg-primary/5'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <EntityBadge type={result.entity.type} size="sm" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {result.entity.text}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <span>
                              Text: {Math.round(result.similarity * 100)}%
                            </span>
                            <span>•</span>
                            <span>
                              Context: {Math.round(result.contextScore * 100)}%
                            </span>
                            <span>•</span>
                            <span className="font-medium text-primary">
                              Total: {Math.round(result.totalScore * 100)}%
                            </span>
                          </div>
                          {result.entity.metadata?.context && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {result.entity.metadata.context}
                            </p>
                          )}
                        </div>
                        {alreadyLinked && (
                          <div className="flex items-center gap-1 text-green-600 text-xs">
                            <Check className="h-3 w-3" />
                            <span>Linked</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        {selectedEntityId && (
          <div className="p-4 border-t bg-muted/20">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-xs font-medium text-muted-foreground uppercase mb-2 block">
                  Link Type
                </label>
                <div className="flex gap-2">
                  {(['similar', 'related', 'references', 'mentions'] as const).map(
                    (type) => (
                      <button
                        key={type}
                        onClick={() => setLinkType(type)}
                        className={cn(
                          'px-3 py-1.5 rounded text-sm font-medium transition-colors capitalize',
                          linkType === type
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted hover:bg-muted/80'
                        )}
                      >
                        {type}
                      </button>
                    )
                  )}
                </div>
              </div>
              <button
                onClick={handleCreateLink}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <Link2 className="h-4 w-4" />
                Create Link
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

