# SemantiKit Documentation Site

This is the official documentation website for SemantiKit, built with [Docusaurus 3](https://docusaurus.io/).

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0+ 
- pnpm 8.0+

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

This starts a local development server at `http://localhost:3000`. Most changes are reflected live without needing to restart the server.

### Build

```bash
pnpm build
```

This command generates static content into the `build` directory that can be served using any static hosting service.

### Deployment

The documentation site is automatically deployed to GitHub Pages when changes are pushed to the `main` branch.

## 📁 Project Structure

```
apps/docs/
├── blog/                    # Blog posts
├── docs/                    # Documentation markdown files
│   ├── getting-started/    # Getting started guides
│   ├── guides/             # How-to guides
│   ├── tutorials/          # Step-by-step tutorials
│   ├── api/                # API reference
│   │   ├── core/          # @semantikit/core API
│   │   ├── react/         # @semantikit/react API
│   │   ├── layouts/       # @semantikit/layouts API
│   │   └── validators/    # @semantikit/validators API
│   ├── examples/          # Example applications
│   ├── architecture/      # Architecture documentation
│   ├── advanced/          # Advanced topics
│   └── contributing/      # Contributing guides
├── src/                    # React components and pages
│   ├── components/        # Reusable components
│   ├── css/              # Custom CSS
│   └── pages/            # Custom pages
├── static/                # Static assets
│   └── img/              # Images
├── docusaurus.config.ts   # Docusaurus configuration
├── sidebars.ts           # Sidebar configuration
└── package.json          # Dependencies and scripts
```

## 📝 Writing Documentation

### Adding a New Page

1. Create a new `.md` or `.mdx` file in the appropriate directory under `docs/`
2. Add frontmatter at the top:

```markdown
---
sidebar_position: 1
title: Your Title
description: Your description
---

# Your Title

Your content here...
```

3. The page will automatically appear in the sidebar based on the `sidebars.ts` configuration

### Markdown Features

Docusaurus supports:

- Standard Markdown
- MDX (React components in Markdown)
- Code blocks with syntax highlighting
- Admonitions (notes, warnings, tips)
- Tabs
- Images
- And more!

### Code Examples

Use fenced code blocks with language identifiers:

````markdown
```typescript
import { KnowledgeGraph } from '@semantikit/core';

const graph = new KnowledgeGraph();
```
````

### Admonitions

```markdown
:::note
This is a note
:::

:::tip
This is a tip
:::

:::warning
This is a warning
:::

:::danger
This is dangerous
:::
```

## 🎨 Customization

### Theme

Modify `src/css/custom.css` to customize colors, fonts, and styles.

### Configuration

Edit `docusaurus.config.ts` to:
- Update site metadata
- Configure plugins
- Modify navigation
- Set up search
- Configure deployment

### Sidebars

Edit `sidebars.ts` to control the documentation sidebar structure.

## 🔍 Search

Search functionality is configured to use Algolia DocSearch. Update the configuration in `docusaurus.config.ts` with your Algolia credentials.

## 📊 Analytics

Analytics can be added by installing the appropriate Docusaurus plugin. See the [Docusaurus docs](https://docusaurus.io/docs/api/plugins) for more information.

## 🚢 Deployment

### GitHub Pages

The site is automatically deployed to GitHub Pages via GitHub Actions when changes are pushed to `main`.

The deployment workflow is defined in `.github/workflows/docs-deploy.yml`.

### Manual Deployment

```bash
# Build the site
pnpm build

# Deploy to GitHub Pages
GIT_USER=<Your GitHub username> pnpm deploy
```

## 📚 Resources

- [Docusaurus Documentation](https://docusaurus.io/docs)
- [Markdown Guide](https://www.markdownguide.org/)
- [MDX Documentation](https://mdxjs.com/)

## 🤝 Contributing

To contribute to the documentation:

1. Follow the [Contributing Guide](../../CONTRIBUTING.md)
2. Ensure documentation is clear, concise, and includes examples
3. Test locally with `pnpm dev`
4. Submit a pull request

## 📄 License

This documentation is part of SemantiKit and is licensed under the MIT License.

