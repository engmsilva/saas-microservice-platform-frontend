import React, { useState, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { Code, ChevronDown, ChevronUp } from 'lucide-react';
import Editor from '@monaco-editor/react';
import prettier from 'prettier/standalone';
import parserBabel from 'prettier/plugins/babel';
import parserTypeScript from 'prettier/plugins/typescript';
import estree from 'prettier/plugins/estree';
import { useTheme } from '../../../contexts/ThemeContext';

interface FunctionNodeData {
  language: string;
  code: string;
}

const defaultCode = {
  javascript: `// Write your JavaScript code here
function process(input) {
  // Process your data here
  return input;
}`,
  typescript: `// Write your TypeScript code here
interface Input {
  data: any;
}

function process(input: Input): any {
  // Process your data here
  return input;
}`
};

export function FunctionNode({ data }: { data: FunctionNodeData }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [language, setLanguage] = useState(data.language || 'javascript');
  const [code, setCode] = useState(data.code || defaultCode[language]);
  const { theme } = useTheme();

  const formatCode = useCallback(async () => {
    try {
      const formatted = await prettier.format(code, {
        parser: language === 'typescript' ? 'typescript' : 'babel',
        plugins: [parserBabel, parserTypeScript, estree],
        semi: true,
        singleQuote: true,
        trailingComma: 'es5',
      });
      setCode(formatted);
    } catch (error) {
      console.error('Failed to format code:', error);
    }
  }, [code, language]);

  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-green-500 relative ${isExpanded ? 'w-[500px]' : 'min-w-[250px]'}`}
      onMouseDown={(e) => {
        if ((e.target as HTMLElement).closest('.monaco-editor')) {
          e.stopPropagation();
        }
      }}
    >
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-green-500" />
            <span className="font-medium text-gray-900 dark:text-white">Function</span>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>
        {!isExpanded && (
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            <div>{language}</div>
            <div className="text-xs mt-1 line-clamp-2 font-mono bg-gray-50 dark:bg-gray-700 p-1 rounded">
              {code.split('\n')[0]}
            </div>
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                setCode(defaultCode[e.target.value]);
              }}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
            </select>
            <button
              onClick={formatCode}
              className="px-3 py-1 text-sm bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-400 rounded hover:bg-green-100 dark:hover:bg-green-800 transition-colors"
            >
              Format Code
            </button>
          </div>
          <Editor
            height="300px"
            language={language}
            value={code}
            onChange={(value) => setCode(value || '')}
            theme={theme === 'dark' ? 'vs-dark' : 'light'}
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollbar: {
                vertical: 'visible',
                horizontal: 'visible',
              },
              automaticLayout: true,
              formatOnPaste: true,
              formatOnType: true,
            }}
          />
        </div>
      )}

      <Handle
        type="target"
        position={Position.Left}
        className="!w-4 !h-4 !bg-green-500 !border-2 !border-white dark:!border-gray-800 hover:!bg-green-600 transition-colors !rounded !left-[-8px]"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-4 !h-4 !bg-green-500 !border-2 !border-white dark:!border-gray-800 hover:!bg-green-600 transition-colors !rounded !right-[-8px]"
      />
    </div>
  );
}