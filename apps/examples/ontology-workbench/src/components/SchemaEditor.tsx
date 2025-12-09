/**
 * Schema Editor component using Monaco Editor
 * Provides YAML editing with syntax highlighting and validation
 */

import { useEffect, useRef } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { useOntologyStore } from '@/stores/ontology-store';
import { Paper, Text, Badge, Group } from '@mantine/core';

export function SchemaEditor() {
  const { schemaText, parsedSchema, setSchemaText } = useOntologyStore();
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<Monaco | null>(null);
  
  function handleEditorMount(editor: any, monaco: Monaco) {
    editorRef.current = editor;
    monacoRef.current = monaco;
    
    // Configure Monaco for YAML
    monaco.languages.yaml?.yamlDefaults.setDiagnosticsOptions({
      validate: true,
      schemas: [],
    });
  }
  
  function handleEditorChange(value: string | undefined) {
    if (value !== undefined) {
      setSchemaText(value);
    }
  }
  
  // Update editor markers based on parse errors
  useEffect(() => {
    if (editorRef.current && monacoRef.current && parsedSchema.errors.length > 0) {
      const monaco = monacoRef.current;
      const model = editorRef.current.getModel();
      
      if (model) {
        const markers = parsedSchema.errors.map((error, index) => ({
          severity: error.severity === 'error' 
            ? monaco.MarkerSeverity.Error 
            : monaco.MarkerSeverity.Warning,
          startLineNumber: error.line || 1,
          startColumn: error.column || 1,
          endLineNumber: error.line || 1,
          endColumn: error.column ? error.column + 10 : 100,
          message: error.message,
        }));
        
        monaco.editor.setModelMarkers(model, 'yaml-validation', markers);
      }
    }
  }, [parsedSchema.errors]);
  
  return (
    <div className="h-full flex flex-col">
      <Paper className="p-3 border-b">
        <Group justify="space-between">
          <div>
            <Text size="sm" fw={600}>Schema Editor</Text>
            <Text size="xs" c="dimmed">Define your ontology in YAML</Text>
          </div>
          
          <Group gap="xs">
            {parsedSchema.valid ? (
              <Badge color="green" variant="light">Valid</Badge>
            ) : parsedSchema.errors.length > 0 ? (
              <Badge color="red" variant="light">
                {parsedSchema.errors.length} Error(s)
              </Badge>
            ) : (
              <Badge color="gray" variant="light">Empty</Badge>
            )}
          </Group>
        </Group>
      </Paper>
      
      <div className="flex-1">
        <Editor
          height="100%"
          defaultLanguage="yaml"
          value={schemaText}
          onChange={handleEditorChange}
          onMount={handleEditorMount}
          theme="vs-light"
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: 'on',
            rulers: [],
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            folding: true,
            renderLineHighlight: 'line',
            scrollbar: {
              vertical: 'auto',
              horizontal: 'auto',
            },
          }}
        />
      </div>
    </div>
  );
}

