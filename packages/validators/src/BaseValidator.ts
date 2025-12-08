import type {
  IValidator,
  ValidatableEntity,
  ValidatorConfig,
  ValidatorOptions,
  ValidationResult,
  ValidationIssue,
  ValidationSeverity,
} from './types';

/**
 * Abstract base class for all validators
 */
export abstract class BaseValidator implements IValidator {
  protected config: Required<ValidatorConfig>;
  protected cache: Map<string, { result: ValidationResult; timestamp: number }>;

  constructor(config: ValidatorConfig = {}) {
    this.config = {
      enabled: config.enabled ?? true,
      cache: config.cache ?? true,
      cacheTTL: config.cacheTTL ?? 5 * 60 * 1000, // 5 minutes default
      cacheSize: config.cacheSize ?? 1000,
      options: config.options ?? {},
    };

    this.cache = new Map();
  }

  /**
   * Validate a single entity (to be implemented by subclasses)
   */
  abstract validate(
    entity: ValidatableEntity,
    options?: ValidatorOptions
  ): Promise<ValidationResult>;

  /**
   * Validate multiple entities in batch
   */
  async validateBatch(
    entities: ValidatableEntity[],
    options?: ValidatorOptions
  ): Promise<ValidationResult[]> {
    return Promise.all(
      entities.map((entity) => this.validate(entity, options))
    );
  }

  /**
   * Clear the validation cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cached validation result if available and not expired
   */
  protected getCachedResult(cacheKey: string): ValidationResult | null {
    if (!this.config.cache) {
      return null;
    }

    const cached = this.cache.get(cacheKey);
    if (!cached) {
      return null;
    }

    const age = Date.now() - cached.timestamp;
    if (age > this.config.cacheTTL) {
      this.cache.delete(cacheKey);
      return null;
    }

    return {
      ...cached.result,
      metadata: {
        ...cached.result.metadata,
        cached: true,
      },
    };
  }

  /**
   * Cache a validation result
   */
  protected cacheResult(cacheKey: string, result: ValidationResult): void {
    if (!this.config.cache) {
      return;
    }

    // Enforce cache size limit (simple LRU: remove oldest)
    if (this.cache.size >= this.config.cacheSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(cacheKey, {
      result,
      timestamp: Date.now(),
    });
  }

  /**
   * Generate a cache key for an entity
   */
  protected generateCacheKey(
    entity: ValidatableEntity,
    options?: ValidatorOptions
  ): string {
    const optionsKey = options ? JSON.stringify(options) : '';
    return `${entity.id}:${entity.type}:${optionsKey}`;
  }

  /**
   * Create a validation issue
   */
  protected createIssue(
    code: string,
    message: string,
    severity: ValidationSeverity,
    path?: string,
    context?: Record<string, unknown>
  ): ValidationIssue {
    return {
      code,
      message,
      severity,
      path,
      context,
    };
  }

  /**
   * Create a successful validation result
   */
  protected createSuccessResult(
    entityId: string,
    entityType: string,
    duration?: number
  ): ValidationResult {
    return {
      valid: true,
      issues: [],
      metadata: {
        entityId,
        entityType,
        timestamp: Date.now(),
        duration,
        cached: false,
      },
    };
  }

  /**
   * Create a failed validation result
   */
  protected createFailureResult(
    entityId: string,
    entityType: string,
    issues: ValidationIssue[],
    duration?: number
  ): ValidationResult {
    return {
      valid: false,
      issues,
      metadata: {
        entityId,
        entityType,
        timestamp: Date.now(),
        duration,
        cached: false,
      },
    };
  }

  /**
   * Filter issues based on options
   */
  protected filterIssues(
    issues: ValidationIssue[],
    options?: ValidatorOptions
  ): ValidationIssue[] {
    let filtered = issues;

    if (!options?.includeWarnings) {
      filtered = filtered.filter(
        (issue) => issue.severity !== ValidationSeverity.WARNING
      );
    }

    if (!options?.includeInfo) {
      filtered = filtered.filter(
        (issue) => issue.severity !== ValidationSeverity.INFO
      );
    }

    return filtered;
  }
}

