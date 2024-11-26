import React from 'react';
import { WorkflowEditor } from './components/workflow/WorkflowEditor';
import { ThemeToggle } from './components/ThemeToggle';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Workflow Editor</h1>
            <ThemeToggle />
          </div>
        </header>
        <main>
          <WorkflowEditor />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;