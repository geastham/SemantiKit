# ADR-002: TypeScript Configuration Strategy

**Status:** Accepted  
**Date:** 2024-01-01  
**Decision Makers:** SemantiKit Team

## Context

SemantiKit is a TypeScript-first library requiring:
- Strict type safety across all packages
- Support for both library and application code
- Incremental builds for fast development
- Proper declaration file generation for consumers

## Decision

We will use a **hierarchical TypeScript configuration** with:
- Root `tsconfig.json` with project references
- Shared `tsconfig.base.json` with strict settings
- Per-package `tsconfig.json` extending the base

### Configuration Hierarchy

```
tsconfig.json              (root - project references)
  ├─ tsconfig.base.json    (shared settings)
  │    ├─ packages/core/tsconfig.json
  │    ├─ packages/react/tsconfig.json
  │    ├─ packages/layouts/tsconfig.json
  │    ├─ packages/validators/tsconfig.json
  │    └─ apps/playground/tsconfig.json
```

### Key Configuration Choices

**Strict Mode:**
```json
{
  "strict": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noFallthroughCasesInSwitch": true,
  "noImplicitReturns": true,
  "noUncheckedIndexedAccess": true
}
```

**Module System:**
- `module: "ESNext"` - Modern module support
- `moduleResolution: "bundler"` - Proper package resolution
- Output both ESM and CJS via tsup

**Project References:**
- Enable `composite: true` in all packages
- Define explicit dependencies between packages
- Support incremental builds

## Rationale

### Why Strict Mode?

1. **Catch Errors Early:** Prevents common bugs at compile time
2. **Better IDE Support:** Improved autocomplete and refactoring
3. **Documentation:** Types serve as inline documentation
4. **Confidence:** Safe refactoring across the codebase

### Why Project References?

1. **Build Speed:** Incremental builds are dramatically faster
2. **Enforced Boundaries:** Prevents circular dependencies
3. **Parallel Builds:** TypeScript can build independent projects in parallel
4. **Better Tooling:** IDEs understand project structure

### Why Shared Base Config?

1. **Consistency:** All packages use same compiler settings
2. **DRY:** Don't repeat configuration
3. **Easy Updates:** Change settings in one place
4. **Override Flexibility:** Packages can override as needed

## Consequences

### Positive

- High confidence in type safety
- Fast incremental builds
- Excellent IDE experience
- Clear dependency graph

### Negative

- More strict = more explicit type annotations required
- Project references add complexity
- Initial setup takes longer

### Neutral

- Developers must understand TypeScript well
- Can't use loose typing as a shortcut

## Implementation

### Base Configuration (`tsconfig.base.json`)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2020", "DOM"],
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "isolatedModules": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitReturns": true,
    "noUncheckedIndexedAccess": true
  }
}
```

### Package Configuration

Each package extends the base and adds:
- `composite: true` for project references
- `outDir` and `rootDir` settings
- Package-specific includes/excludes
- References to dependencies

## Alternatives Considered

1. **Loose TypeScript Config:** Rejected for quality concerns
2. **No Project References:** Rejected due to slow builds
3. **Separate Configs:** Too much duplication
4. **JavaScript with JSDoc:** Rejected, TypeScript is better

## Migration Path

For gradual adoption of strictness:
1. Start with `strict: false`
2. Enable one strict flag at a time
3. Fix violations incrementally
4. Fully strict by Phase 1 completion

## References

- [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)
- [TypeScript Compiler Options](https://www.typescriptlang.org/tsconfig)
- [Strict Mode Benefits](https://www.typescriptlang.org/tsconfig#strict)

