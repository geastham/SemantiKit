/**
 * Toolbar component
 * Top action bar with save, export, import, and template loading
 */

import { useState } from 'react';
import { useOntologyStore } from '@/stores/ontology-store';
import { Group, Button, Menu, Text } from '@mantine/core';
import { 
  IconDownload, 
  IconUpload, 
  IconFileText,
  IconTrash,
  IconTemplate,
} from '@tabler/icons-react';
import { exportAsJSON, exportAsJSONLD, exportAsGraphML, downloadFile } from '@/lib/export-formats';
import { TemplateSelector } from './TemplateSelector';

export function Toolbar() {
  const { exportGraph, importGraph, clearAll, isDirty } = useOntologyStore();
  const [templateOpen, setTemplateOpen] = useState(false);
  
  const handleExportJSON = () => {
    const data = exportGraph();
    const json = exportAsJSON(data.nodes, data.edges, data.schema);
    downloadFile(json, 'ontology.json', 'application/json');
  };
  
  const handleExportJSONLD = () => {
    const data = exportGraph();
    const jsonld = exportAsJSONLD(data.nodes, data.edges, data.schema);
    downloadFile(jsonld, 'ontology.jsonld', 'application/ld+json');
  };
  
  const handleExportGraphML = () => {
    const data = exportGraph();
    const graphml = exportAsGraphML(data.nodes, data.edges, data.schema);
    downloadFile(graphml, 'ontology.graphml', 'application/xml');
  };
  
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        
        if (data.nodes && data.edges) {
          importGraph({ nodes: data.nodes, edges: data.edges });
        } else {
          alert('Invalid file format. Must contain nodes and edges.');
        }
      } catch (error) {
        alert('Failed to import file: ' + (error as Error).message);
      }
    };
    input.click();
  };
  
  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear the entire graph? This cannot be undone.')) {
      clearAll();
    }
  };
  
  return (
    <>
      <div className="border-b bg-white px-4 py-2">
        <Group justify="space-between">
          <Group gap="md">
            <div>
              <Text size="lg" fw={700}>Ontology Workbench</Text>
              <Text size="xs" c="dimmed">Schema-driven graph editor</Text>
            </div>
          </Group>
          
          <Group gap="xs">
            <Button
              variant="light"
              size="xs"
              leftSection={<IconTemplate size={16} />}
              onClick={() => setTemplateOpen(true)}
            >
              Load Template
            </Button>
            
            <Button
              variant="light"
              size="xs"
              leftSection={<IconUpload size={16} />}
              onClick={handleImport}
            >
              Import
            </Button>
            
            <Menu position="bottom-end">
              <Menu.Target>
                <Button
                  variant="light"
                  size="xs"
                  leftSection={<IconDownload size={16} />}
                >
                  Export
                </Button>
              </Menu.Target>
              
              <Menu.Dropdown>
                <Menu.Item 
                  leftSection={<IconFileText size={16} />}
                  onClick={handleExportJSON}
                >
                  Export as JSON
                </Menu.Item>
                <Menu.Item 
                  leftSection={<IconFileText size={16} />}
                  onClick={handleExportJSONLD}
                >
                  Export as JSON-LD
                </Menu.Item>
                <Menu.Item 
                  leftSection={<IconFileText size={16} />}
                  onClick={handleExportGraphML}
                >
                  Export as GraphML
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
            
            <Button
              variant="light"
              color="red"
              size="xs"
              leftSection={<IconTrash size={16} />}
              onClick={handleClearAll}
            >
              Clear All
            </Button>
          </Group>
        </Group>
      </div>
      
      <TemplateSelector
        opened={templateOpen}
        onClose={() => setTemplateOpen(false)}
      />
    </>
  );
}

