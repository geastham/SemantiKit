# @semantikit/validators

Schema and AI-powered validation for SemantiKit knowledge graphs.

## Features

- **Schema Validation**: Type-safe validation using Zod schemas
- **LLM Validation**: AI-powered semantic validation with OpenAI GPT-4
- **Smart Caching**: Automatic result caching to reduce API calls
- **Flexible Configuration**: Customizable validation rules and options

## Installation

```bash
npm install @semantikit/validators
# or
pnpm add @semantikit/validators
```

## Quick Start

### Schema Validation

```typescript
import { SchemaValidator, SchemaHelpers } from '@semantikit/validators';
import { z } from 'zod';

// Create validator
const validator = new SchemaValidator();

// Register node type schema
validator.registerSchema({
  type: 'Person',
  schema: SchemaHelpers.createNodeSchema({
    name: z.string().min(1),
    age: z.number().min(0).optional(),
    email: z.string().email().optional(),
  }),
});

// Validate a node
const result = await validator.validate({
  id: '1',
  type: 'Person',
  name: 'Alice',
  age: 30,
});

if (!result.valid) {
  console.log('Validation issues:', result.issues);
}
```

### LLM Validation

```typescript
import { LLMValidator } from '@semantikit/validators';

// Create validator with API key
const validator = new LLMValidator({
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4-turbo-preview',
  cache: true,
});

// Validate semantic correctness
const result = await validator.validate({
  id: '1',
  type: 'Person',
  name: 'Alice',
  occupation: 'Software Engineer',
  birthYear: 2050, // This will be flagged as semantically incorrect
});

if (!result.valid) {
  result.issues.forEach((issue) => {
    console.log(`${issue.severity}: ${issue.message}`);
  });
}
```

## API Reference

### SchemaValidator

Validates entities against Zod schemas.

**Methods:**
- `registerSchema(typeSchema: TypeSchema)` - Register a type schema
- `validate(entity, options?)` - Validate an entity
- `validateBatch(entities, options?)` - Validate multiple entities
- `clearCache()` - Clear validation cache

### LLMValidator

Validates entities using AI for semantic correctness.

**Methods:**
- `validate(entity, options?)` - Validate an entity
- `validateBatch(entities, options?)` - Validate multiple entities  
- `setSystemPrompt(prompt)` - Customize validation prompt
- `clearCache()` - Clear validation cache

### Validation Options

```typescript
interface ValidatorOptions {
  failFast?: boolean; // Stop on first error
  includeWarnings?: boolean; // Include warnings in results
  includeInfo?: boolean; // Include info messages
  context?: Record<string, unknown>; // Additional context
}
```

## Configuration

### Schema Validator Config

```typescript
interface SchemaValidatorConfig {
  enabled?: boolean; // Enable/disable validation
  cache?: boolean; // Enable caching
  cacheTTL?: number; // Cache time-to-live (ms)
  cacheSize?: number; // Maximum cache entries
  allowUnknownTypes?: boolean; // Allow types without schemas
  stripUnknown?: boolean; // Strip unknown properties
}
```

### LLM Validator Config

```typescript
interface LLMValidatorConfig {
  apiKey?: string; // OpenAI API key
  model?: string; // Model to use (default: gpt-4-turbo-preview)
  maxTokens?: number; // Max completion tokens
  temperature?: number; // Generation temperature
  systemPrompt?: string; // Custom system prompt
  timeout?: number; // API timeout (ms)
  maxRetries?: number; // Retry attempts
  batchSize?: number; // Batch validation size
}
```

## Examples

### Combining Validators

```typescript
import { SchemaValidator, LLMValidator } from '@semantikit/validators';

const schemaValidator = new SchemaValidator();
const llmValidator = new LLMValidator({ apiKey: API_KEY });

async function validateNode(node) {
  // First check schema
  const schemaResult = await schemaValidator.validate(node);
  if (!schemaResult.valid) {
    return schemaResult;
  }

  // Then check semantics
  const llmResult = await llmValidator.validate(node);
  return llmResult;
}
```

### Custom Validation Logic

```typescript
import { BaseValidator } from '@semantikit/validators';

class CustomValidator extends BaseValidator {
  async validate(entity, options) {
    const issues = [];

    // Your custom validation logic
    if (entity.value < 0) {
      issues.push(
        this.createIssue(
          'NEGATIVE_VALUE',
          'Value cannot be negative',
          ValidationSeverity.ERROR,
          'value'
        )
      );
    }

    return issues.length > 0
      ? this.createFailureResult(entity.id, entity.type, issues)
      : this.createSuccessResult(entity.id, entity.type);
  }
}
```

## License

MIT

