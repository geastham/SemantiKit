# SemantiKit

> A powerful, flexible TypeScript library for building knowledge graph applications

[![CI](https://github.com/geastham/SemantiKit/actions/workflows/ci.yml/badge.svg)](https://github.com/geastham/SemantiKit/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## 🚀 Overview

SemantiKit is a comprehensive knowledge graph toolkit that makes it easy to build, visualize, and manage semantic data in your applications. Built with TypeScript and React, it provides a headless core engine with beautiful, customizable UI components.

## ✨ Features

- **Headless Core**: Framework-agnostic graph engine (`@semantikit/core`)
- **React Integration**: Hooks and components for React apps (`@semantikit/react`)
- **Type-Safe**: Built with TypeScript for excellent developer experience
- **Flexible Layouts**: Multiple graph layout algorithms (`@semantikit/layouts`)
- **Schema Validation**: Define and enforce data schemas (`@semantikit/validators`)
- **Performant**: Optimized for graphs with 5,000+ nodes
- **Extensible**: Plugin architecture for custom behaviors

## 📦 Packages

This monorepo contains the following packages:

| Package | Description | Version |
|---------|-------------|---------|
| [`@semantikit/core`](./packages/core) | Headless knowledge graph engine | 0.1.0-alpha.1 |
| [`@semantikit/react`](./packages/react) | React components and hooks | 0.1.0-alpha.1 |
| [`@semantikit/layouts`](./packages/layouts) | Graph layout algorithms | 0.1.0-alpha.1 |
| [`@semantikit/validators`](./packages/validators) | Schema validation utilities | 0.1.0-alpha.1 |

## 🏁 Quick Start

### Prerequisites

- Node.js 18.0.0 or higher
- pnpm 8.0.0 or higher

### Installation

```bash
# Install pnpm if you haven't already
npm install -g pnpm

# Clone the repository
git clone https://github.com/geastham/SemantiKit.git
cd SemantiKit

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test
```

### Development

```bash
# Start development mode (watch mode for all packages)
pnpm dev

# Run linting
pnpm lint

# Run type checking
pnpm typecheck

# Format code
pnpm format
```

## 📚 Documentation

- [Getting Started](./docs/getting-started.md) - Learn the basics
- [Architecture](./docs/architecture.md) - Understand the design
- [API Reference](./apps/docs) - Detailed API documentation
- [Examples](./apps/examples) - Sample applications
- [Contributing](./CONTRIBUTING.md) - How to contribute

## 🏗️ Project Structure

```
semantikit/
├── packages/
│   ├── core/              # @semantikit/core - Headless graph engine
│   ├── react/             # @semantikit/react - React integration
│   ├── layouts/           # @semantikit/layouts - Layout algorithms
│   └── validators/        # @semantikit/validators - Validation utilities
├── apps/
│   ├── docs/              # Documentation site (Docusaurus)
│   ├── playground/        # Development sandbox
│   └── examples/          # Example applications
├── docs/                  # Project documentation & ADRs
└── .github/               # CI/CD workflows
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

## 📄 License

MIT © Garrett Eastham

## 🔗 Links

- [Documentation](https://geastham.github.io/SemantiKit)
- [NPM Packages](https://www.npmjs.com/org/semantikit)
- [Issue Tracker](https://github.com/geastham/SemantiKit/issues)
- [Discussions](https://github.com/geastham/SemantiKit/discussions)

---

**Status**: Phase 0 (Alpha) - Under active development

This project is currently in Phase 0 of development. The API is subject to change. Production use is not recommended at this time.

