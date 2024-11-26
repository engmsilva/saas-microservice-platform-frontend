import React, { useState, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { Code, ChevronDown, ChevronUp } from 'lucide-react';
import Editor from '@monaco-editor/react';
import prettier from 'prettier/standalone';
import parserBabel from 'prettier/plugins/babel';
import parserTypeScript from 'prettier/plugins/typescript';
import estree from 'prettier/plugins/estree';
import { useDisableDrag } from '../../../hooks/useDisableDrag';
import { useDisableDrop } from '../../../hooks/useDisableDrop';

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
  const { setIsDropDisabled } = useDisableDrop();

  useDisableDrag();

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

  const handleEditorFocus = useCallback(() => {
    setIsDropDisabled(true);
  }, [setIsDropDisabled]);

  const handleEditorBlur = useCallback(() => {
    setIsDropDisabled(false);
  }, [setIsDropDisabled]);

  return (
    <div className={`bg-white rounded-lg shadow-lg relative ${isExpanded ? 'w-[500px]' : 'min-w-[250px]'}`}>
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-green-500" />
            <span className="font-medium">Function</span>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
        {!isExpanded && (
          <div className="mt-2 text-sm text-gray-600">
            <div>{language}</div>
            <div className="text-xs mt-1 line-clamp-2 font-mono bg-gray-50 p-1 rounded">
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
              className="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
            </select>
            <button
              onClick={formatCode}
              className="px-3 py-1 text-sm bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors"
            >
              Format Code
            </button>
          </div>
          <Editor
            height="300px"
            language={language}
            value={code}
            onChange={(value) => setCode(value || '')}
            onFocus={handleEditorFocus}
            onBlur={handleEditorBlur}
            theme="vs-light"
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
        className="!w-4 !h-4 !bg-green-500 !border-2 !border-white hover:!bg-green-600 transition-colors !rounded !left-[-8px]"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-4 !h-4 !bg-green-500 !border-2 !border-white hover:!bg-green-600 transition-colors !rounded !right-[-8px]"
      />
    </div>
  );
}