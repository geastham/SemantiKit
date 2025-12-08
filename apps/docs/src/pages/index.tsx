import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/getting-started/introduction">
            Get Started - 5min ⏱️
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            to="/docs/examples/overview"
            style={{marginLeft: '1rem'}}>
            View Examples
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} - ${siteConfig.tagline}`}
      description="A powerful, flexible TypeScript library for building knowledge graph applications">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        
        {/* Quick Start Section */}
        <section className={styles.quickStart}>
          <div className="container">
            <h2>Quick Start</h2>
            <div className={styles.codeBlock}>
              <pre>
                <code>{`# Install packages
npm install @semantikit/core @semantikit/react

# Or with pnpm
pnpm add @semantikit/core @semantikit/react

# Or with yarn
yarn add @semantikit/core @semantikit/react`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* Example Usage Section */}
        <section className={styles.exampleUsage}>
          <div className="container">
            <h2>Example Usage</h2>
            <div className={styles.codeExample}>
              <pre>
                <code>{`import { KnowledgeGraph } from '@semantikit/core';
import { KnowledgeGraphProvider, useKnowledgeGraph } from '@semantikit/react';

// Create a knowledge graph
const graph = new KnowledgeGraph();

// Add nodes
graph.addNode({
  id: '1',
  type: 'Person',
  properties: { name: 'Alice', role: 'Developer' }
});

// Add edges
graph.addEdge({
  id: 'e1',
  source: '1',
  target: '2',
  type: 'WorksWith'
});

// Use in React
function MyComponent() {
  const { graph, operations } = useKnowledgeGraph();
  
  return (
    <div>
      <p>Nodes: {graph.nodeCount}</p>
      <p>Edges: {graph.edgeCount}</p>
    </div>
  );
}`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className={styles.cta}>
          <div className="container text--center">
            <h2>Ready to build your knowledge graph?</h2>
            <p>Get started with SemantiKit in minutes</p>
            <Link
              className="button button--primary button--lg"
              to="/docs/getting-started/quick-start">
              Read the Docs
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}

