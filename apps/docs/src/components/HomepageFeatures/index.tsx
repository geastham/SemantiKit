import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  icon: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Headless Core',
    icon: '🎯',
    description: (
      <>
        Framework-agnostic graph engine that works anywhere. Use with React, Vue, 
        Angular, or vanilla JavaScript. Full TypeScript support out of the box.
      </>
    ),
  },
  {
    title: 'Type-Safe',
    icon: '🔒',
    description: (
      <>
        Built with TypeScript for excellent developer experience. Comprehensive
        type definitions, autocomplete support, and compile-time safety.
      </>
    ),
  },
  {
    title: 'Performant',
    icon: '⚡',
    description: (
      <>
        Optimized for graphs with 5,000+ nodes. Efficient indexing, virtual rendering,
        and smart memoization ensure smooth performance.
      </>
    ),
  },
  {
    title: 'React Integration',
    icon: '⚛️',
    description: (
      <>
        Powerful hooks and components for React apps. Context-based state management,
        declarative API, and seamless integration with React Flow.
      </>
    ),
  },
  {
    title: 'Schema Validation',
    icon: '✅',
    description: (
      <>
        Define and enforce data schemas with built-in validators. Support for
        custom validation rules, cardinality constraints, and type checking.
      </>
    ),
  },
  {
    title: 'AI-Powered',
    icon: '🤖',
    description: (
      <>
        Optional AI integration for entity extraction, relationship suggestions,
        and validation feedback. Bring your own LLM or use our defaults.
      </>
    ),
  },
  {
    title: 'Flexible Layouts',
    icon: '📐',
    description: (
      <>
        Multiple graph layout algorithms included. Force-directed, hierarchical,
        circular layouts, and support for custom layout engines.
      </>
    ),
  },
  {
    title: 'Extensible',
    icon: '🔌',
    description: (
      <>
        Plugin architecture for custom behaviors. Add your own validators,
        layouts, serializers, and integrations.
      </>
    ),
  },
  {
    title: 'Developer Friendly',
    icon: '💝',
    description: (
      <>
        Comprehensive documentation, interactive examples, and great DX.
        Get started in minutes with our quick start guide.
      </>
    ),
  },
];

function Feature({title, icon, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <div className={styles.featureIcon}>{icon}</div>
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <h2 className="text--center" style={{marginBottom: '3rem', fontSize: '2.5rem'}}>
          Why SemantiKit?
        </h2>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

