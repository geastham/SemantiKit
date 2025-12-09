/**
 * Validation result types for graph constraint checking
 */

export type ValidationSeverity = 'error' | 'warning' | 'info';

export interface ValidationIssue {
  id: string;
  severity: ValidationSeverity;
  message: string;
  elementId?: string; // Node or edge ID
  elementType: 'node' | 'edge' | 'schema';
  constraint?: string; // Which constraint was violated
  suggestedFix?: string;
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
  errorCount: number;
  warningCount: number;
  infoCount: number;
  timestamp: number;
}

export interface ValidationStats {
  totalNodes: number;
  totalEdges: number;
  validNodes: number;
  validEdges: number;
  nodeTypeDistribution: Record<string, number>;
  edgeTypeDistribution: Record<string, number>;
}

