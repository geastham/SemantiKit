import OpenAI from 'openai';
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
 * Configuration for LLM-based validation
 */
export interface LLMValidatorConfig extends ValidatorConfig {
  /** OpenAI API key */
  apiKey?: string;
  /** OpenAI model to use */
  model?: string;
  /** Maximum tokens for completion */
  maxTokens?: number;
  /** Temperature for generation */
  temperature?: number;
  /** Custom system prompt */
  systemPrompt?: string;
  /** Timeout for API calls in ms */
  timeout?: number;
  /** Maximum retries on failure */
  maxRetries?: number;
  /** Batch size for batch validation */
  batchSize?: number;
}

/**
 * LLM validation response
 */
interface LLMValidationResponse {
  valid: boolean;
  issues: Array<{
    code: string;
    message: string;
    severity: 'error' | 'warning' | 'info';
    path?: string;
  }>;
  suggestions?: string[];
}

/**
 * Validator that uses LLM for semantic validation
 */
export class LLMValidator extends BaseValidator {
  private client: OpenAI;
  private model: string;
  private maxTokens: number;
  private temperature: number;
  private systemPrompt: string;
  private timeout: number;
  private maxRetries: number;
  private batchSize: number;

  constructor(config: LLMValidatorConfig = {}) {
    super(config);

    if (!config.apiKey && !process.env.OPENAI_API_KEY) {
      throw new Error(
        'OpenAI API key is required. Provide it in config or set OPENAI_API_KEY environment variable.'
      );
    }

    this.client = new OpenAI({
      apiKey: config.apiKey || process.env.OPENAI_API_KEY,
      timeout: config.timeout || 30000,
    });

    this.model = config.model || 'gpt-4-turbo-preview';
    this.maxTokens = config.maxTokens || 1000;
    this.temperature = config.temperature || 0.3;
    this.timeout = config.timeout || 30000;
    this.maxRetries = config.maxRetries || 3;
    this.batchSize = config.batchSize || 5;

    this.systemPrompt =
      config.systemPrompt ||
      `You are a knowledge graph validation assistant. Your task is to validate nodes and edges in a knowledge graph for semantic correctness, consistency, and quality.

For each entity, analyze:
1. Semantic correctness - Does the entity make sense in context?
2. Data quality - Are properties appropriate and complete?
3. Relationships - Do connections make logical sense?
4. Consistency - Is this consistent with common knowledge?

Respond with a JSON object in this exact format:
{
  "valid": boolean,
  "issues": [
    {
      "code": "SEMANTIC_ERROR|QUALITY_WARNING|CONSISTENCY_INFO",
      "message": "Clear description of the issue",
      "severity": "error|warning|info",
      "path": "property.path (optional)"
    }
  ],
  "suggestions": ["Helpful suggestions for improvement (optional)"]
}`;
  }

  /**
   * Validate an entity using LLM
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

    try {
      const response = await this.callLLM(entity, options);
      const llmResponse = this.parseLLMResponse(response);

      // Convert LLM issues to ValidationIssue format
      if (llmResponse.issues) {
        for (const issue of llmResponse.issues) {
          const severity = this.mapSeverity(issue.severity);
          issues.push(
            this.createIssue(
              issue.code || 'LLM_VALIDATION',
              issue.message,
              severity,
              issue.path,
              {
                suggestions: llmResponse.suggestions,
                context: options?.context,
              }
            )
          );

          // Stop on first error if failFast is enabled
          if (options?.failFast && severity === ValidationSeverity.ERROR) {
            break;
          }
        }
      }
    } catch (error) {
      issues.push(
        this.createIssue(
          'LLM_ERROR',
          `LLM validation failed: ${error instanceof Error ? error.message : String(error)}`,
          ValidationSeverity.ERROR,
          undefined,
          {
            error: error instanceof Error ? error.message : String(error),
          }
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
   * Validate entities in batch (more efficient for LLM)
   */
  async validateBatch(
    entities: ValidatableEntity[],
    options?: ValidatorOptions
  ): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    // Process in batches
    for (let i = 0; i < entities.length; i += this.batchSize) {
      const batch = entities.slice(i, i + this.batchSize);

      // Check cache for each entity
      const uncached: ValidatableEntity[] = [];
      const cachedIndices: number[] = [];

      batch.forEach((entity, idx) => {
        const cacheKey = this.generateCacheKey(entity, options);
        const cached = this.getCachedResult(cacheKey);
        if (cached) {
          results[i + idx] = cached;
          cachedIndices.push(i + idx);
        } else {
          uncached.push(entity);
        }
      });

      // Validate uncached entities
      if (uncached.length > 0) {
        const batchResults = await Promise.all(
          uncached.map((entity) => this.validate(entity, options))
        );

        let uncachedIdx = 0;
        for (let j = 0; j < batch.length; j++) {
          if (!cachedIndices.includes(i + j)) {
            results[i + j] = batchResults[uncachedIdx++];
          }
        }
      }
    }

    return results;
  }

  /**
   * Call the LLM API with retry logic
   */
  private async callLLM(
    entity: ValidatableEntity,
    options?: ValidatorOptions,
    attempt: number = 1
  ): Promise<string> {
    try {
      const userPrompt = this.buildUserPrompt(entity, options);

      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: this.systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: this.maxTokens,
        temperature: this.temperature,
        response_format: { type: 'json_object' },
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from LLM');
      }

      return content;
    } catch (error) {
      if (attempt < this.maxRetries) {
        // Exponential backoff
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
        return this.callLLM(entity, options, attempt + 1);
      }

      throw error;
    }
  }

  /**
   * Build the user prompt for validation
   */
  private buildUserPrompt(
    entity: ValidatableEntity,
    options?: ValidatorOptions
  ): string {
    let prompt = `Validate this ${entity.type} entity:\n\n`;
    prompt += `ID: ${entity.id}\n`;
    prompt += `Type: ${entity.type}\n`;
    prompt += `Properties:\n${JSON.stringify(entity, null, 2)}\n\n`;

    if (options?.context) {
      prompt += `Context:\n${JSON.stringify(options.context, null, 2)}\n\n`;
    }

    prompt += `Provide validation results in JSON format.`;

    return prompt;
  }

  /**
   * Parse LLM response
   */
  private parseLLMResponse(response: string): LLMValidationResponse {
    try {
      const parsed = JSON.parse(response);

      // Validate response structure
      if (typeof parsed.valid !== 'boolean') {
        throw new Error('Invalid response: missing "valid" field');
      }

      return {
        valid: parsed.valid,
        issues: parsed.issues || [],
        suggestions: parsed.suggestions,
      };
    } catch (error) {
      throw new Error(
        `Failed to parse LLM response: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Map severity string to enum
   */
  private mapSeverity(severity: string): ValidationSeverity {
    switch (severity.toLowerCase()) {
      case 'error':
        return ValidationSeverity.ERROR;
      case 'warning':
        return ValidationSeverity.WARNING;
      case 'info':
        return ValidationSeverity.INFO;
      default:
        return ValidationSeverity.WARNING;
    }
  }

  /**
   * Update system prompt
   */
  setSystemPrompt(prompt: string): void {
    this.systemPrompt = prompt;
  }

  /**
   * Get current system prompt
   */
  getSystemPrompt(): string {
    return this.systemPrompt;
  }
}

