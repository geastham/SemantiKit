/**
 * Custom node component for React Flow
 * Displays node with schema-based styling and validation feedback
 */

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { NodeData } from '@/types';
import { IconUser, IconBuilding, IconFileText, IconBriefcase, IconRobot } from '@tabler/icons-react';

const iconMap: Record<string, React.ComponentType<any>> = {
  user: IconUser,
  building: IconBuilding,
  'file-text': IconFileText,
  briefcase: IconBriefcase,
  robot: IconRobot,
};

function CustomNodeComponent({ data, selected }: NodeProps<NodeData>) {
  const hasErrors = data.validationErrors && data.validationErrors.length > 0;
  const Icon = iconMap[data.type] || IconUser;
  
  return (
    <div
      className={`
        px-4 py-3 rounded-lg border-2 bg-white shadow-md
        transition-all duration-200
        ${selected ? 'ring-2 ring-blue-400' : ''}
        ${hasErrors ? 'border-red-500' : 'border-gray-300'}
        hover:shadow-lg
      `}
      style={{
        minWidth: '180px',
        maxWidth: '220px',
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-blue-500"
      />
      
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 mt-1">
          <Icon size={20} className="text-gray-600" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            {data.type}
          </div>
          <div className="font-semibold text-gray-900 truncate">
            {data.label}
          </div>
          
          {Object.keys(data.properties).length > 0 && (
            <div className="mt-2 text-xs text-gray-600">
              {Object.keys(data.properties).length} properties
            </div>
          )}
          
          {hasErrors && (
            <div className="mt-2 text-xs text-red-600 font-medium">
              ⚠ {data.validationErrors!.length} error(s)
            </div>
          )}
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-blue-500"
      />
    </div>
  );
}

export const CustomNode = memo(CustomNodeComponent);

