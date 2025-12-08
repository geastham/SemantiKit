/**
 * Core types for the validators package
 */

/**
 * Severity level for validation issues
 */
export enum ValidationSeverity {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

/**
 * A single validation issue
 */
export interface ValidationIssue {
  /** Unique identifier for the issue type */
  code: string;
  /** Human-readable message */
  message: string;
  /** Severity level */
  severity: ValidationSeverity;
  /** Path to the property with the issue (e.g., 'properties.name') */
  path?: string;
  /** Additional context about the issue */
  context?: Record<string, unknown>;
}

/**
 * Result of a validation operation
 */
export interface ValidationResult {
  /** Whether the validation passed */
  valid: boolean;
  /** List of issues found */
  issues: ValidationIssue[];
  /** Metadata about the validation */
  metadata?: {
    /** ID of the node/edge that was validated */
    entityId?: string;
    /** Type of entity validated */
    entityType?: string;
    /** Timestamp of validation */
    timestamp?: number;
    /** Duration of validation in ms */
    duration?: number;
    /** Whether result came from cache */
    cached?: boolean;
  };
}

/**
 * Configuration for validators
 */
export interface ValidatorConfig {
  /** Whether to enable validation */
  enabled?: boolean;
  /** Whether to cache validation results */
  cache?: boolean;
  /** Cache TTL in milliseconds */
  cacheTTL?: number;
  /** Maximum number of cached results */
  cacheSize?: number;
  /** Custom validation options */
  options?: Record<string, unknown>;
}

/**
 * Options for validation operations
 */
export interface ValidatorOptions {
  /** Whether to stop on first error */
  failFast?: boolean;
  /** Whether to include warnings */
  includeWarnings?: boolean;
  /** Whether to include info messages */
  includeInfo?: boolean;
  /** Context for validation */
  context?: Record<string, unknown>;
}

/**
 * Entity that can be validated (node or edge)
 */
export interface ValidatableEntity {
  id: string;
  type: string;
  [key: string]: unknown;
}

/**
 * Base validator interface
 */
export interface IValidator {
  /**
   * Validate a single entity
   */
  validate(
    entity: ValidatableEntity,
    options?: ValidatorOptions
  ): Promise<ValidationResult>;

  /**
   * Validate multiple entities
   */
  validateBatch(
    entities: ValidatableEntity[],
    options?: ValidatorOptions
  ): Promise<ValidationResult[]>;

  /**
   * Clear validation cache
   */
  clearCache?(): void;
}

