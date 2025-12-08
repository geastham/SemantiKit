# Installation

Get started with SemantiKit by installing the packages you need.

## Prerequisites

Before installing SemantiKit, make sure you have:

- **Node.js** 18.0.0 or higher
- **npm** 8.0.0 or higher (or **pnpm** 8.0.0+ / **yarn** 3.0.0+)

## Package Selection

SemantiKit is published as separate npm packages. Install only what you need:

| Package | Description | When to Use |
|---------|-------------|-------------|
| `@semantikit/core` | Headless graph engine | Always required |
| `@semantikit/react` | React integration | Building React apps |
| `@semantikit/layouts` | Layout algorithms | Need graph layouts |
| `@semantikit/validators` | Schema validation | Need validation |

## Installation Methods

### Using npm

```bash
# Install core package (required)
npm install @semantikit/core

# Install React integration (for React apps)
npm install @semantikit/react

# Install additional packages as needed
npm install @semantikit/layouts @semantikit/validators
```

### Using pnpm

```bash
# Install core package (required)
pnpm add @semantikit/core

# Install React integration (for React apps)
pnpm add @semantikit/react

# Install additional packages as needed
pnpm add @semantikit/layouts @semantikit/validators
```

### Using Yarn

```bash
# Install core package (required)
yarn add @semantikit/core

# Install React integration (for React apps)
yarn add @semantikit/react

# Install additional packages as needed
yarn add @semantikit/layouts @semantikit/validators
```

## Quick Install (React)

For React applications, install all packages at once:

```bash
npm install @semantikit/core @semantikit/react @semantikit/layouts @semantikit/validators
```

## Peer Dependencies

### For @semantikit/react

The React package requires React 18.0 or higher:

```bash
npm install react@^18.0.0 react-dom@^18.0.0
```

If you want to use the graph visualization components, also install React Flow:

```bash
npm install reactflow
```

### For @semantikit/layouts

The layouts package uses elkjs for hierarchical layouts:

```bash
npm install elkjs
```

## TypeScript Configuration

SemantiKit is built with TypeScript and includes type definitions. No additional @types packages are needed.

Add these settings to your `tsconfig.json` for the best experience:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "jsx": "react-jsx"
  }
}
```

## Verification

Verify your installation by checking the package versions:

```bash
npm list @semantikit/core
npm list @semantikit/react
```

Or import in your code:

```typescript
import { KnowledgeGraph } from '@semantikit/core';

console.log('SemantiKit is installed!');
```

## Development Setup

If you want to contribute to SemantiKit or run examples locally:

```bash
# Clone the repository
git clone https://github.com/geastham/SemantiKit.git
cd SemantiKit

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Start development mode
pnpm dev
```

## Troubleshooting

### Module not found

If you get a "Module not found" error:

1. **Check installation**: Verify the package is installed with `npm list @semantikit/core`
2. **Clear cache**: Run `npm cache clean --force` and reinstall
3. **Check node_modules**: Ensure `node_modules/@semantikit/` exists

### Type errors

If you see TypeScript errors:

1. **Update TypeScript**: Ensure you're using TypeScript 5.0+
2. **Check tsconfig**: Use the recommended TypeScript configuration above
3. **Restart IDE**: Reload your editor/IDE to refresh type definitions

### React version conflicts

If you see React peer dependency warnings:

1. **Update React**: SemantiKit requires React 18.0+
2. **Check versions**: Run `npm list react` to see all React versions in your project
3. **Dedupe**: Run `npm dedupe` to consolidate versions

## Next Steps

Now that you have SemantiKit installed, let's build your first knowledge graph:

**[Continue to Quick Start →](./quick-start)**

## Version Information

Current stable version: **1.0.0**

See the [CHANGELOG](https://github.com/geastham/SemantiKit/blob/main/CHANGELOG.md) for release notes and migration guides.

## Getting Help

- 📚 [Documentation](https://geastham.github.io/SemantiKit/)
- 💬 [GitHub Discussions](https://github.com/geastham/SemantiKit/discussions)
- 🐛 [Issue Tracker](https://github.com/geastham/SemantiKit/issues)
- 📦 [npm Packages](https://www.npmjs.com/org/semantikit)

