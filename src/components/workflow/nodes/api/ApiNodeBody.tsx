import React from 'react';
import { Plus, X } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';

interface FormParam {
  key: string;
  value: string;
  type?: 'text' | 'file';
}

interface ApiNodeBodyProps {
  bodyType: string;
  setBodyType: (type: string) => void;
  bodyContent: string;
  setBodyContent: (content: string) => void;
  formData: FormParam[];
  setFormData: (data: FormParam[]) => void;
  urlEncoded: FormParam[];
  setUrlEncoded: (data: FormParam[]) => void;
}

export function ApiNodeBody({
  bodyType,
  setBodyType,
  bodyContent,
  setBodyContent,
  formData,
  setFormData,
  urlEncoded,
  setUrlEncoded
}: ApiNodeBodyProps) {
  const { theme } = useTheme();

  const addFormData = () => {
    setFormData([...formData, { key: '', value: '', type: 'text' }]);
  };

  const addUrlEncoded = () => {
    setUrlEncoded([...urlEncoded, { key: '', value: '' }]);
  };

  return (
    <div>
      <div className="flex gap-4 mb-4">
        {['none', 'form-data', 'x-www-form-urlencoded', 'json'].map((type) => (
          <label key={type} className="inline-flex items-center">
            <input
              type="radio"
              value={type}
              checked={bodyType === type}
              onChange={(e) => setBodyType(e.target.value)}
              className="mr-2 text-blue-500"
            />
            <span className="text-gray-700 dark:text-gray-300">
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
          </label>
        ))}
      </div>

      {bodyType === 'json' && (
        <Editor
          height="200px"
          defaultLanguage="json"
          value={bodyContent}
          onChange={(value) => setBodyContent(value || '')}
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            formatOnPaste: true,
            formatOnType: true,
          }}
        />
      )}

      {/* Form Data Section */}
      {bodyType === 'form-data' && (
        <div className="space-y-2">
          {formData.map((item, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Key"
                value={item.key}
                onChange={(e) => {
                  const newFormData = [...formData];
                  newFormData[index].key = e.target.value;
                  setFormData(newFormData);
                }}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <select
                value={item.type}
                onChange={(e) => {
                  const newFormData = [...formData];
                  newFormData[index].type = e.target.value as 'text' | 'file';
                  setFormData(newFormData);
                }}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="text">Text</option>
                <option value="file">File</option>
              </select>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newFormData = [...formData];
                  newFormData.splice(index, 1);
                  setFormData(newFormData);
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={addFormData}
            className="flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add Form Data
          </Button>
        </div>
      )}

      {/* URL Encoded Section */}
      {bodyType === 'x-www-form-urlencoded' && (
        <div className="space-y-2">
          {urlEncoded.map((item, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Key"
                value={item.key}
                onChange={(e) => {
                  const newUrlEncoded = [...urlEncoded];
                  newUrlEncoded[index].key = e.target.value;
                  setUrlEncoded(newUrlEncoded);
                }}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <input
                type="text"
                placeholder="Value"
                value={item.value}
                onChange={(e) => {
                  const newUrlEncoded = [...urlEncoded];
                  newUrlEncoded[index].value = e.target.value;
                  setUrlEncoded(newUrlEncoded);
                }}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newUrlEncoded = [...urlEncoded];
                  newUrlEncoded.splice(index, 1);
                  setUrlEncoded(newUrlEncoded);
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={addUrlEncoded}
            className="flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add URL Encoded
          </Button>
        </div>
      )}
    </div>
  );
}