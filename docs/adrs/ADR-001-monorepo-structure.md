# ADR-001: Monorepo Structure with pnpm Workspaces and Turborepo

**Status:** Accepted  
**Date:** 2024-01-01  
**Decision Makers:** SemantiKit Team

## Context

SemantiKit requires a development infrastructure that supports:
- Multiple related packages (`core`, `react`, `layouts`, `validators`)
- Internal applications (`playground`, `docs`, `examples`)
- Efficient dependency management and build orchestration
- Easy local development and testing across packages

## Decision

We will use a **monorepo structure** with:
- **pnpm workspaces** for dependency management
- **Turborepo** for build orchestration and caching
- Packages in `packages/` directory
- Internal apps in `apps/` directory

### Package Structure

```
packages/
  core/          - @semantikit/core (headless engine)
  react/         - @semantikit/react (React integration)
  layouts/       - @semantikit/layouts (layout algorithms)
  validators/    - @semantikit/validators (schema validation)

apps/
  playground/    - Development sandbox
  docs/          - Docusaurus documentation site
  examples/      - Example applications
```

## Rationale

### Why Monorepo?

1. **Code Sharing:** Easy to share types and utilities between packages
2. **Atomic Changes:** Single PR can update multiple packages
3. **Simplified Versioning:** Coordinate releases across packages
4. **Better DX:** One git clone, one `pnpm install`

### Why pnpm?

1. **Fast:** Faster than npm/yarn due to content-addressable storage
2. **Efficient:** Saves disk space with symlinked dependencies
3. **Strict:** Better at catching dependency issues
4. **Workspace Support:** First-class monorepo support

### Why Turborepo?

1. **Caching:** Intelligent caching of build outputs
2. **Parallelization:** Runs tasks in parallel respecting dependencies
3. **Minimal Config:** Simple `turbo.json` configuration
4. **CI/CD Friendly:** Easy to integrate with GitHub Actions

## Consequences

### Positive

- Simplified dependency management
- Faster builds with caching
- Easier cross-package refactoring
- Single source of truth for versions

### Negative

- Learning curve for developers new to monorepos
- Need to maintain workspace configuration
- Potential for package coupling if not careful

### Neutral

- All developers must use pnpm (enforced via `engines` field)
- Build commands must go through Turborepo

## Implementation

- Root `package.json` defines workspaces
- `pnpm-workspace.yaml` configures workspace patterns
- `turbo.json` defines build pipeline
- Each package has its own `package.json`
- Internal dependencies use `workspace:*` protocol

## Alternatives Considered

1. **Separate Repositories:** Rejected due to coordination overhead
2. **Yarn Workspaces:** pnpm chosen for better performance
3. **Nx:** Turborepo chosen for simpler configuration
4. **Lerna:** Considered legacy, Turborepo more modern

## References

- [pnpm Workspaces Documentation](https://pnpm.io/workspaces)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Monorepo Best Practices](https://monorepo.tools/)

