import React from 'react';
import { WorkflowEditor } from './components/workflow/WorkflowEditor';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Workflow Editor</h1>
        </div>
      </header>
      <main>
        <WorkflowEditor />
      </main>
    </div>
  );
}

export default App;