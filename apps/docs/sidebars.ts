import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'getting-started/introduction',
        'getting-started/installation',
        'getting-started/quick-start',
        'getting-started/core-concepts',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/creating-graphs',
        'guides/working-with-schemas',
        'guides/layouts',
        'guides/validation',
        'guides/serialization',
        'guides/ai-integration',
        'guides/performance',
        'guides/testing',
      ],
    },
    {
      type: 'category',
      label: 'Tutorials',
      items: [
        'tutorials/basic-usage',
        'tutorials/ai-integration',
        'tutorials/custom-layouts',
        'tutorials/custom-validators',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        {
          type: 'category',
          label: '@semantikit/core',
          items: [
            'api/core/introduction',
            'api/core/KnowledgeGraph',
            'api/core/operations',
            'api/core/serialization',
            'api/core/types',
          ],
        },
        {
          type: 'category',
          label: '@semantikit/react',
          items: [
            'api/react/introduction',
            'api/react/KnowledgeGraphProvider',
            'api/react/hooks',
            'api/react/ai-hooks',
          ],
        },
        {
          type: 'category',
          label: '@semantikit/layouts',
          items: [
            'api/layouts/introduction',
            'api/layouts/BaseLayout',
            'api/layouts/built-in-layouts',
            'api/layouts/custom-layouts',
          ],
        },
        {
          type: 'category',
          label: '@semantikit/validators',
          items: [
            'api/validators/introduction',
            'api/validators/BaseValidator',
            'api/validators/SchemaValidator',
            'api/validators/LLMValidator',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Examples',
      items: [
        'examples/overview',
        'examples/rag-admin',
        'examples/ontology-workbench',
        'examples/document-curator',
      ],
    },
    {
      type: 'category',
      label: 'Architecture',
      items: [
        'architecture/overview',
        'architecture/design-principles',
        'architecture/package-structure',
        'architecture/type-system',
        'architecture/extensibility',
      ],
    },
    {
      type: 'category',
      label: 'Advanced',
      items: [
        'advanced/performance-optimization',
        'advanced/large-graphs',
        'advanced/accessibility',
        'advanced/browser-compatibility',
        'advanced/migration-guide',
      ],
    },
    {
      type: 'category',
      label: 'Contributing',
      items: [
        'contributing/getting-started',
        'contributing/development-setup',
        'contributing/code-style',
        'contributing/testing',
        'contributing/documentation',
        'contributing/pull-requests',
      ],
    },
  ],
};

export default sidebars;

