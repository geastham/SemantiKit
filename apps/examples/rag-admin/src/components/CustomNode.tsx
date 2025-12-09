'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { useGraphStore } from '@/lib/graph-store';
import { User, Folder, FileText, Lightbulb } from 'lucide-react';

const iconMap: Record<string, any> = {
  User,
  Folder,
  FileText,
  Lightbulb,
};

function CustomNode({ data, selected }: NodeProps) {
  const schema = useGraphStore((state) => state.schema);
  const nodeType = schema.nodeTypes[data.type];
  
  const Icon = iconMap[nodeType?.icon || 'Folder'];
  const color = nodeType?.color || '#94a3b8';

  return (
    <div
      className={`
        px-4 py-3 rounded-lg border-2 bg-card shadow-md min-w-[150px]
        transition-all duration-200
        ${selected ? 'ring-2 ring-primary ring-offset-2 shadow-lg' : 'hover:shadow-lg'}
      `}
      style={{
        borderColor: selected ? color : `${color}80`,
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3"
        style={{ background: color }}
      />
      
      <div className="flex items-start gap-2">
        <div
          className="p-1.5 rounded"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon
            size={16}
            style={{ color }}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">
            {data.label}
          </div>
          <div
            className="text-xs mt-0.5"
            style={{ color: `${color}dd` }}
          >
            {nodeType?.label || data.type}
          </div>
        </div>
      </div>

      {data.description && (
        <div className="mt-2 text-xs text-muted-foreground line-clamp-2">
          {data.description}
        </div>
      )}
      
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3"
        style={{ background: color }}
      />
    </div>
  );
}

export default memo(CustomNode);

