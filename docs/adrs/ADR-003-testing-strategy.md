# ADR-003: Testing Strategy

**Status:** Accepted  
**Date:** 2024-01-01  
**Decision Makers:** SemantiKit Team

## Context

SemantiKit requires comprehensive testing to ensure:
- Core engine correctness and reliability
- React components work as expected
- Regressions are caught early
- Confidence for contributors and users

## Decision

We will implement a **multi-layered testing strategy**:

### Test Framework: Jest + React Testing Library

- **Jest** for test runner and assertions
- **ts-jest** for TypeScript support
- **React Testing Library** for component testing
- **jsdom** for DOM simulation in tests

### Coverage Requirements

**@semantikit/core:** 90% coverage (high confidence required)
**@semantikit/react:** 80% coverage (UI complexity considered)
**@semantikit/layouts:** 80% coverage
**@semantikit/validators:** 80% coverage

### Test Types

1. **Unit Tests**
   - Individual functions and classes
   - Located in `__tests__` directories
   - Naming: `*.test.ts` or `*.test.tsx`

2. **Integration Tests**
   - Multiple components working together
   - Graph operations across systems
   - React hooks with context

3. **Snapshot Tests** (where appropriate)
   - Component rendering
   - Serialization formats
   - Error messages

## Rationale

### Why Jest?

1. **Industry Standard:** Widely used, well documented
2. **Fast:** Parallel test execution
3. **Rich API:** Excellent matchers and mocking
4. **TypeScript Support:** Works great with ts-jest
5. **Coverage Built-in:** Integrated coverage reporting

### Why React Testing Library?

1. **User-Centric:** Tests how users interact with components
2. **Best Practices:** Encourages accessible component design
3. **Less Brittle:** Tests don't break on implementation changes
4. **Community Standard:** Recommended by React team

### Why High Coverage?

1. **Confidence:** Safe to refactor
2. **Documentation:** Tests show how to use the API
3. **Regression Prevention:** Catch bugs before users
4. **Contributor Safety:** Easy to contribute without breaking things

## Consequences

### Positive

- High confidence in code quality
- Clear examples of how to use APIs
- Safe refactoring
- Easy to onboard contributors

### Negative

- Takes time to write tests
- Must maintain tests alongside code
- Coverage requirements can slow development

### Neutral

- Developers must write tests (required for PRs)
- CI will fail if coverage drops

## Implementation

### Workspace Configuration

Root `jest.config.js` orchestrates all package tests:

```javascript
module.exports = {
  projects: [
    '<rootDir>/packages/core',
    '<rootDir>/packages/react',
    '<rootDir>/packages/layouts',
    '<rootDir>/packages/validators',
  ],
};
```

### Package Configuration Example

`packages/core/jest.config.js`:

```javascript
module.exports = {
  displayName: '@semantikit/core',
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};
```

### Test Organization

```
packages/core/src/
  ├─ graph/
  │   ├─ KnowledgeGraph.ts
  │   └─ __tests__/
  │       └─ KnowledgeGraph.test.ts
  ├─ operations/
  │   ├─ OperationsManager.ts
  │   └─ __tests__/
  │       └─ OperationsManager.test.ts
```

### CI Integration

- Tests run on every push and PR
- Coverage reports uploaded to Codecov
- PRs blocked if tests fail or coverage drops

## Testing Best Practices

1. **Arrange-Act-Assert:** Structure tests clearly
2. **One Assertion Per Test:** Keep tests focused
3. **Descriptive Names:** Test names explain what's being tested
4. **Mock External Dependencies:** Tests should be isolated
5. **Test Edge Cases:** Not just happy paths

## Example Test Structure

```typescript
describe('KnowledgeGraph', () => {
  describe('addNode', () => {
    it('should add a valid node to the graph', () => {
      // Arrange
      const graph = new KnowledgeGraph();
      const node: KGNode = { id: '1', type: 'Person', label: 'Alice' };

      // Act
      graph.addNode(node);

      // Assert
      expect(graph.getNode('1')).toEqual(node);
      expect(graph.getNodes()).toHaveLength(1);
    });

    it('should throw error when adding node with duplicate ID', () => {
      // Arrange
      const graph = new KnowledgeGraph();
      const node: KGNode = { id: '1', type: 'Person', label: 'Alice' };
      graph.addNode(node);

      // Act & Assert
      expect(() => graph.addNode(node)).toThrow('Node with ID 1 already exists');
    });
  });
});
```

## Alternatives Considered

1. **Vitest:** Faster but less mature ecosystem
2. **Mocha + Chai:** More configuration required
3. **No Coverage Requirements:** Too risky
4. **100% Coverage:** Too expensive, diminishing returns

## Future Enhancements

- **Visual Regression Testing:** For UI components (Phase 2)
- **E2E Testing:** With Playwright (Phase 3)
- **Performance Testing:** Benchmarks for large graphs (Phase 2)
- **Mutation Testing:** Stryker for test quality (Phase 3)

## References

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

