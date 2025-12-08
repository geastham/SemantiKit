import { z } from 'zod';
import { BaseValidator } from './BaseValidator';
import type {
  ValidatableEntity,
  ValidatorConfig,
  ValidatorOptions,
  ValidationResult,
  ValidationIssue,
} from './types';
import { ValidationSeverity } from './types';

/**
 * Schema definition for a node or edge type
 */
export interface TypeSchema {
  /** Type identifier */
  type: string;
  /** Zod schema for validation */
  schema: z.ZodType<any>;
  /** Optional description */
  description?: string;
}

/**
 * Configuration for SchemaValidator
 */
export interface SchemaValidatorConfig extends ValidatorConfig {
  /** Map of type names to their schemas */
  schemas?: Map<string, TypeSchema>;
  /** Whether to allow unknown types */
  allowUnknownTypes?: boolean;
  /** Whether to strip unknown properties */
  stripUnknown?: boolean;
}

/**
 * Validator that validates entities against Zod schemas
 */
export class SchemaValidator extends BaseValidator {
  private schemas: Map<string, TypeSchema>;
  private allowUnknownTypes: boolean;
  private stripUnknown: boolean;

  constructor(config: SchemaValidatorConfig = {}) {
    super(config);
    this.schemas = config.schemas || new Map();
    this.allowUnknownTypes = config.allowUnknownTypes ?? false;
    this.stripUnknown = config.stripUnknown ?? false;
  }

  /**
   * Register a schema for a type
   */
  registerSchema(typeSchema: TypeSchema): void {
    this.schemas.set(typeSchema.type, typeSchema);
  }

  /**
   * Register multiple schemas
   */
  registerSchemas(schemas: TypeSchema[]): void {
    schemas.forEach((schema) => this.registerSchema(schema));
  }

  /**
   * Get registered schema for a type
   */
  getSchema(type: string): TypeSchema | undefined {
    return this.schemas.get(type);
  }

  /**
   * Remove a schema
   */
  removeSchema(type: string): boolean {
    return this.schemas.delete(type);
  }

  /**
   * Validate an entity against its registered schema
   */
  async validate(
    entity: ValidatableEntity,
    options?: ValidatorOptions
  ): Promise<ValidationResult> {
    if (!this.config.enabled) {
      return this.createSuccessResult(entity.id, entity.type);
    }

    const startTime = Date.now();

    // Check cache
    const cacheKey = this.generateCacheKey(entity, options);
    const cachedResult = this.getCachedResult(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    const issues: ValidationIssue[] = [];

    // Check if type has a schema
    const typeSchema = this.schemas.get(entity.type);
    if (!typeSchema) {
      if (!this.allowUnknownTypes) {
        issues.push(
          this.createIssue(
            'UNKNOWN_TYPE',
            `No schema registered for type "${entity.type}"`,
            ValidationSeverity.ERROR,
            'type',
            { type: entity.type }
          )
        );
      } else {
        issues.push(
          this.createIssue(
            'UNKNOWN_TYPE',
            `No schema registered for type "${entity.type}", but unknown types are allowed`,
            ValidationSeverity.WARNING,
            'type',
            { type: entity.type }
          )
        );
      }

      const duration = Date.now() - startTime;
      const result =
        issues.length > 0 && issues.some((i) => i.severity === ValidationSeverity.ERROR)
          ? this.createFailureResult(entity.id, entity.type, issues, duration)
          : this.createSuccessResult(entity.id, entity.type, duration);

      this.cacheResult(cacheKey, result);
      return result;
    }

    // Validate against schema
    try {
      const parseResult = typeSchema.schema.safeParse(entity);

      if (!parseResult.success) {
        // Convert Zod errors to validation issues
        parseResult.error.issues.forEach((zodIssue) => {
          const path = zodIssue.path.join('.');
          issues.push(
            this.createIssue(
              `SCHEMA_${zodIssue.code}`,
              zodIssue.message,
              ValidationSeverity.ERROR,
              path,
              {
                zodCode: zodIssue.code,
                expected: 'expected' in zodIssue ? zodIssue.expected : undefined,
                received: 'received' in zodIssue ? zodIssue.received : undefined,
              }
            )
          );

          // Stop on first error if failFast is enabled
          if (options?.failFast) {
            return;
          }
        });
      }
    } catch (error) {
      issues.push(
        this.createIssue(
          'VALIDATION_ERROR',
          `Unexpected error during validation: ${error instanceof Error ? error.message : String(error)}`,
          ValidationSeverity.ERROR,
          undefined,
          { error: error instanceof Error ? error.message : String(error) }
        )
      );
    }

    const duration = Date.now() - startTime;
    const filteredIssues = this.filterIssues(issues, options);

    const result =
      filteredIssues.length > 0 &&
      filteredIssues.some((i) => i.severity === ValidationSeverity.ERROR)
        ? this.createFailureResult(entity.id, entity.type, filteredIssues, duration)
        : this.createSuccessResult(entity.id, entity.type, duration);

    this.cacheResult(cacheKey, result);
    return result;
  }

  /**
   * Validate an entity and return the parsed result if valid
   */
  async validateAndParse<T = ValidatableEntity>(
    entity: ValidatableEntity,
    options?: ValidatorOptions
  ): Promise<{ valid: true; data: T } | { valid: false; result: ValidationResult }> {
    const result = await this.validate(entity, options);

    if (!result.valid) {
      return { valid: false, result };
    }

    const typeSchema = this.schemas.get(entity.type);
    if (!typeSchema) {
      return { valid: true, data: entity as T };
    }

    const parseResult = typeSchema.schema.safeParse(entity);
    if (parseResult.success) {
      return { valid: true, data: parseResult.data as T };
    }

    return { valid: false, result };
  }
}

/**
 * Helper function to create common Zod schemas
 */
export const SchemaHelpers = {
  /**
   * Create a base node schema
   */
  createNodeSchema: (additionalProps?: z.ZodRawShape) => {
    return z.object({
      id: z.string(),
      type: z.string(),
      label: z.string().optional(),
      position: z
        .object({
          x: z.number(),
          y: z.number(),
        })
        .optional(),
      ...additionalProps,
    });
  },

  /**
   * Create a base edge schema
   */
  createEdgeSchema: (additionalProps?: z.ZodRawShape) => {
    return z.object({
      id: z.string(),
      type: z.string(),
      source: z.string(),
      target: z.string(),
      directed: z.boolean().default(true),
      label: z.string().optional(),
      ...additionalProps,
    });
  },
};

