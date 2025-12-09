/**
 * Main App component
 * Three-pane layout with Toolbar, SchemaEditor, GraphView, and ValidationPanel
 */

import { ReactFlowProvider } from 'reactflow';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { Toolbar } from './components/Toolbar';
import { SchemaEditor } from './components/SchemaEditor';
import { GraphView } from './components/GraphView';
import { ValidationPanel } from './components/ValidationPanel';
import './styles/globals.css';

function App() {
  return (
    <MantineProvider>
      <ReactFlowProvider>
        <div className="h-screen flex flex-col bg-gray-50">
          <Toolbar />
          
          <div className="flex-1 flex overflow-hidden">
            {/* Left Panel - Schema Editor */}
            <div className="w-1/3 border-r bg-white">
              <SchemaEditor />
            </div>
            
            {/* Center Panel - Graph View */}
            <div className="flex-1 bg-gray-100">
              <GraphView />
            </div>
            
            {/* Right Panel - Validation */}
            <div className="w-1/4 border-l bg-white">
              <ValidationPanel />
            </div>
          </div>
        </div>
      </ReactFlowProvider>
    </MantineProvider>
  );
}

export default App;

