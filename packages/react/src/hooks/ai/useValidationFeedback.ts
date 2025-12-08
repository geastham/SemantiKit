import { useState, useCallback } from 'react';
import type { ValidationResult } from '@semantikit/validators';
import type { AIHookState, AIConfig } from './types';

export function useValidationFeedback(config: AIConfig = {}) {
  const [state, setState] = useState<AIHookState<ValidationResult>>({ data: null, loading: false, error: null });

  const validate = useCallback(async (entity: any): Promise<ValidationResult | null> => {
    setState({ data: null, loading: true, error: null });
    try {
      const result: ValidationResult = { valid: true, issues: [], metadata: {} };
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      setState({ data: null, loading: false, error: err });
      return null;
    }
  }, []);

  return { ...state, validate };
}
