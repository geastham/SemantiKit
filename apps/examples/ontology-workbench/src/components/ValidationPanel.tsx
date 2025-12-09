/**
 * Validation Panel component
 * Displays real-time validation results and schema information
 */

import { useOntologyStore } from '@/stores/ontology-store';
import { 
  Paper, 
  Text, 
  Badge, 
  Group, 
  Stack, 
  Accordion,
  Alert,
  Button,
  ScrollArea,
  Divider,
} from '@mantine/core';
import { 
  IconAlertCircle, 
  IconAlertTriangle, 
  IconInfoCircle, 
  IconCheck,
  IconRefresh,
} from '@tabler/icons-react';

export function ValidationPanel() {
  const { 
    parsedSchema, 
    validationResult, 
    autoValidate,
    setAutoValidate,
    runValidation,
    nodes,
    edges,
  } = useOntologyStore();
  
  const schema = parsedSchema.schema;
  
  const errorIssues = validationResult.issues.filter((i) => i.severity === 'error');
  const warningIssues = validationResult.issues.filter((i) => i.severity === 'warning');
  const infoIssues = validationResult.issues.filter((i) => i.severity === 'info');
  
  return (
    <div className="h-full flex flex-col">
      <Paper className="p-3 border-b">
        <Group justify="space-between" mb="xs">
          <div>
            <Text size="sm" fw={600}>Validation</Text>
            <Text size="xs" c="dimmed">Real-time constraint checking</Text>
          </div>
          
          <Button
            size="xs"
            variant="light"
            leftSection={<IconRefresh size={14} />}
            onClick={runValidation}
          >
            Validate
          </Button>
        </Group>
        
        <Group gap="xs">
          <Badge 
            color={validationResult.errorCount > 0 ? 'red' : 'green'} 
            variant="light"
          >
            {validationResult.errorCount} Errors
          </Badge>
          <Badge color="yellow" variant="light">
            {validationResult.warningCount} Warnings
          </Badge>
          <Badge color="blue" variant="light">
            {nodes.length} Nodes
          </Badge>
          <Badge color="grape" variant="light">
            {edges.length} Edges
          </Badge>
        </Group>
      </Paper>
      
      <ScrollArea className="flex-1">
        <div className="p-3">
          <Stack gap="md">
            {/* Schema Status */}
            {schema && (
              <Paper p="md" withBorder>
                <Text size="sm" fw={600} mb="xs">Schema Information</Text>
                <Stack gap="xs">
                  <Group gap="xs">
                    <Text size="xs" c="dimmed">Name:</Text>
                    <Text size="xs" fw={500}>{schema.name}</Text>
                  </Group>
                  {schema.version && (
                    <Group gap="xs">
                      <Text size="xs" c="dimmed">Version:</Text>
                      <Text size="xs">{schema.version}</Text>
                    </Group>
                  )}
                  <Group gap="xs">
                    <Text size="xs" c="dimmed">Node Types:</Text>
                    <Badge size="sm" variant="light">
                      {Object.keys(schema.nodeTypes).length}
                    </Badge>
                  </Group>
                  <Group gap="xs">
                    <Text size="xs" c="dimmed">Edge Types:</Text>
                    <Badge size="sm" variant="light">
                      {Object.keys(schema.edgeTypes).length}
                    </Badge>
                  </Group>
                </Stack>
              </Paper>
            )}
            
            {/* Validation Summary */}
            {validationResult.errorCount === 0 && validationResult.warningCount === 0 ? (
              <Alert 
                icon={<IconCheck size={16} />} 
                color="green" 
                title="All Valid"
              >
                <Text size="xs">
                  Your graph conforms to the schema with no errors or warnings.
                </Text>
              </Alert>
            ) : (
              <Alert 
                icon={<IconAlertCircle size={16} />} 
                color={validationResult.errorCount > 0 ? 'red' : 'yellow'}
                title="Validation Issues Found"
              >
                <Text size="xs">
                  Found {validationResult.errorCount} error(s) and {validationResult.warningCount} warning(s).
                </Text>
              </Alert>
            )}
            
            {/* Validation Issues */}
            {validationResult.issues.length > 0 && (
              <Accordion>
                {/* Errors */}
                {errorIssues.length > 0 && (
                  <Accordion.Item value="errors">
                    <Accordion.Control icon={<IconAlertCircle size={16} color="red" />}>
                      <Group gap="xs">
                        <Text size="sm" fw={500}>Errors</Text>
                        <Badge size="sm" color="red">{errorIssues.length}</Badge>
                      </Group>
                    </Accordion.Control>
                    <Accordion.Panel>
                      <Stack gap="xs">
                        {errorIssues.map((issue) => (
                          <Paper key={issue.id} p="xs" withBorder>
                            <Text size="xs" fw={500} c="red">{issue.message}</Text>
                            {issue.constraint && (
                              <Text size="xs" c="dimmed" mt={4}>
                                Constraint: {issue.constraint}
                              </Text>
                            )}
                            {issue.suggestedFix && (
                              <Text size="xs" c="blue" mt={4}>
                                💡 {issue.suggestedFix}
                              </Text>
                            )}
                          </Paper>
                        ))}
                      </Stack>
                    </Accordion.Panel>
                  </Accordion.Item>
                )}
                
                {/* Warnings */}
                {warningIssues.length > 0 && (
                  <Accordion.Item value="warnings">
                    <Accordion.Control icon={<IconAlertTriangle size={16} color="orange" />}>
                      <Group gap="xs">
                        <Text size="sm" fw={500}>Warnings</Text>
                        <Badge size="sm" color="yellow">{warningIssues.length}</Badge>
                      </Group>
                    </Accordion.Control>
                    <Accordion.Panel>
                      <Stack gap="xs">
                        {warningIssues.map((issue) => (
                          <Paper key={issue.id} p="xs" withBorder>
                            <Text size="xs" fw={500} c="orange">{issue.message}</Text>
                            {issue.constraint && (
                              <Text size="xs" c="dimmed" mt={4}>
                                Constraint: {issue.constraint}
                              </Text>
                            )}
                          </Paper>
                        ))}
                      </Stack>
                    </Accordion.Panel>
                  </Accordion.Item>
                )}
                
                {/* Info */}
                {infoIssues.length > 0 && (
                  <Accordion.Item value="info">
                    <Accordion.Control icon={<IconInfoCircle size={16} color="blue" />}>
                      <Group gap="xs">
                        <Text size="sm" fw={500}>Info</Text>
                        <Badge size="sm" color="blue">{infoIssues.length}</Badge>
                      </Group>
                    </Accordion.Control>
                    <Accordion.Panel>
                      <Stack gap="xs">
                        {infoIssues.map((issue) => (
                          <Paper key={issue.id} p="xs" withBorder>
                            <Text size="xs">{issue.message}</Text>
                          </Paper>
                        ))}
                      </Stack>
                    </Accordion.Panel>
                  </Accordion.Item>
                )}
              </Accordion>
            )}
            
            {/* Schema Parse Errors */}
            {parsedSchema.errors.length > 0 && (
              <>
                <Divider />
                <Paper p="md" withBorder>
                  <Text size="sm" fw={600} c="red" mb="xs">Schema Parse Errors</Text>
                  <Stack gap="xs">
                    {parsedSchema.errors.map((error, index) => (
                      <Alert key={index} color="red" p="xs">
                        <Text size="xs">{error.message}</Text>
                      </Alert>
                    ))}
                  </Stack>
                </Paper>
              </>
            )}
          </Stack>
        </div>
      </ScrollArea>
    </div>
  );
}

