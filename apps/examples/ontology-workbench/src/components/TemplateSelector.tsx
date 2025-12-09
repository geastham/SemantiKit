/**
 * Template Selector component
 * Modal for loading pre-defined schema templates
 */

import { Modal, Stack, Card, Text, Button, Group, Badge } from '@mantine/core';
import { useOntologyStore } from '@/stores/ontology-store';
import customTemplate from '@/templates/custom.yaml?raw';
import foafTemplate from '@/templates/foaf.yaml?raw';
import dublinCoreTemplate from '@/templates/dublin-core.yaml?raw';

interface Template {
  name: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
}

const templates: Template[] = [
  {
    name: 'custom',
    title: 'Custom Ontology',
    description: 'A minimal starting point with Person and Organization entities. Perfect for building your own custom ontology from scratch.',
    content: customTemplate,
    tags: ['Starter', 'Simple'],
  },
  {
    name: 'foaf',
    title: 'FOAF (Friend of a Friend)',
    description: 'A well-established ontology for describing people and their social networks. Includes Person, Agent, Organization, Document, and Project types.',
    content: foafTemplate,
    tags: ['Social', 'Standard'],
  },
  {
    name: 'dublin-core',
    title: 'Dublin Core',
    description: 'Standard metadata vocabulary for describing digital and physical resources. Widely used in libraries and archives.',
    content: dublinCoreTemplate,
    tags: ['Metadata', 'Standard'],
  },
];

interface TemplateSelectorProps {
  opened: boolean;
  onClose: () => void;
}

export function TemplateSelector({ opened, onClose }: TemplateSelectorProps) {
  const { loadTemplate } = useOntologyStore();
  
  const handleSelectTemplate = (template: Template) => {
    loadTemplate(template.name, template.content);
    onClose();
  };
  
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Load Schema Template"
      size="lg"
    >
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Start with a pre-defined ontology template or create your own from scratch.
        </Text>
        
        {templates.map((template) => (
          <Card key={template.name} padding="lg" withBorder>
            <Stack gap="sm">
              <div>
                <Group justify="space-between" mb="xs">
                  <Text fw={600}>{template.title}</Text>
                  <Group gap="xs">
                    {template.tags.map((tag) => (
                      <Badge key={tag} size="sm" variant="light">
                        {tag}
                      </Badge>
                    ))}
                  </Group>
                </Group>
                
                <Text size="sm" c="dimmed">
                  {template.description}
                </Text>
              </div>
              
              <Button
                variant="light"
                size="sm"
                onClick={() => handleSelectTemplate(template)}
              >
                Load {template.title}
              </Button>
            </Stack>
          </Card>
        ))}
      </Stack>
    </Modal>
  );
}

