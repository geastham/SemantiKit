'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Entity } from '@/types';
import { CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EntityNodeData {
  entity: Entity;
  color: string;
}

export const EntityNode = memo(({ data }: NodeProps<EntityNodeData>) => {
  const { entity, color } = data;

  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2"
        style={{ background: color }}
      />
      
      <div
        className={cn(
          'px-4 py-2 rounded-lg border-2 shadow-lg bg-background min-w-[120px] max-w-[200px]',
          'transition-all hover:shadow-xl hover:scale-105'
        )}
        style={{ borderColor: color }}
      >
        {/* Entity Type Badge */}
        <div
          className="absolute -top-2 -left-2 px-2 py-0.5 rounded text-xs font-bold uppercase shadow-sm"
          style={{
            backgroundColor: color,
            color: '#ffffff',
          }}
        >
          {entity.type}
        </div>

        {/* Entity Text */}
        <div className="font-medium text-sm text-center break-words">
          {entity.text}
        </div>

        {/* Confidence */}
        <div className="flex items-center justify-center gap-1 mt-1">
          <Sparkles className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {Math.round(entity.confidence * 100)}%
          </span>
        </div>

        {/* Status Indicators */}
        {(entity.approved || entity.rejected) && (
          <div className="flex justify-center mt-1">
            {entity.approved && (
              <CheckCircle2 className="h-3 w-3 text-green-600" />
            )}
            {entity.rejected && (
              <XCircle className="h-3 w-3 text-red-600" />
            )}
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2"
        style={{ background: color }}
      />
    </div>
  );
});

EntityNode.displayName = 'EntityNode';

