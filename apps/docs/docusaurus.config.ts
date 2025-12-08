import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'SemantiKit',
  tagline: 'A powerful, flexible TypeScript library for building knowledge graph applications',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://geastham.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/SemantiKit/',

  // GitHub pages deployment config
  organizationName: 'geastham',
  projectName: 'SemantiKit',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Internationalization
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/geastham/SemantiKit/tree/main/apps/docs/',
          remarkPlugins: [],
          rehypePlugins: [],
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/geastham/SemantiKit/tree/main/apps/docs/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/semantikit-social-card.jpg',
    navbar: {
      title: 'SemantiKit',
      logo: {
        alt: 'SemantiKit Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          to: '/docs/api/core/introduction',
          label: 'API',
          position: 'left',
        },
        {
          to: '/docs/examples/overview',
          label: 'Examples',
          position: 'left',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/geastham/SemantiKit',
          label: 'GitHub',
          position: 'right',
        },
        {
          type: 'docsVersionDropdown',
          position: 'right',
          dropdownActiveClassDisabled: true,
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/getting-started/installation',
            },
            {
              label: 'Tutorials',
              to: '/docs/tutorials/basic-usage',
            },
            {
              label: 'API Reference',
              to: '/docs/api/core/introduction',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub Discussions',
              href: 'https://github.com/geastham/SemantiKit/discussions',
            },
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/semantikit',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/semantikit',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/geastham/SemantiKit',
            },
            {
              label: 'npm',
              href: 'https://www.npmjs.com/org/semantikit',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Garrett Eastham. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['typescript', 'javascript', 'jsx', 'tsx', 'json', 'bash'],
    },
    algolia: {
      // Search configuration - to be added later
      appId: 'YOUR_APP_ID',
      apiKey: 'YOUR_SEARCH_API_KEY',
      indexName: 'semantikit',
      contextualSearch: true,
    },
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    announcementBar: {
      id: 'version_1_0',
      content:
        '🎉 SemantiKit v1.0.0 is now available! Check out the <a target="_blank" rel="noopener noreferrer" href="/blog/v1-release">release notes</a>.',
      backgroundColor: '#fafbfc',
      textColor: '#091E42',
      isCloseable: true,
    },
  } satisfies Preset.ThemeConfig,

  plugins: [
    // Add TypeDoc plugin for API documentation
    // [
    //   'docusaurus-plugin-typedoc',
    //   {
    //     entryPoints: ['../../packages/core/src/index.ts'],
    //     tsconfig: '../../packages/core/tsconfig.json',
    //     out: 'api',
    //     sidebar: {
    //       categoryLabel: 'API Reference',
    //       position: 3,
    //     },
    //   },
    // ],
  ],
};

export default config;

