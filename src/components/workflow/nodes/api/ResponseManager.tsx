import React, { useState } from 'react';
import { Plus, X, AlertCircle } from 'lucide-react';
import Editor from '@monaco-editor/react';

interface HttpResponse {
  code: string;
  description: string;
  content: string;
}

interface ResponseManagerProps {
  responses: HttpResponse[];
  onUpdate: (responses: HttpResponse[]) => void;
}

export function ResponseManager({ responses, onUpdate }: ResponseManagerProps) {
  const [selectedResponse, setSelectedResponse] = useState<HttpResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addResponse = () => {
    const newResponse: HttpResponse = {
      code: '',
      description: '',
      content: '{}',
    };
    onUpdate([...responses, newResponse]);
    setSelectedResponse(newResponse);
  };

  const updateResponse = (updatedResponse: HttpResponse) => {
    try {
      // Validate JSON
      JSON.parse(updatedResponse.content);
      setError(null);

      const newResponses = responses.map((response) =>
        response === selectedResponse ? updatedResponse : response
      );
      onUpdate(newResponses);
      setSelectedResponse(updatedResponse);
    } catch (e) {
      setError('Invalid JSON format');
    }
  };

  const deleteResponse = (responseToDelete: HttpResponse) => {
    const newResponses = responses.filter((response) => response !== responseToDelete);
    onUpdate(newResponses);
    if (selectedResponse === responseToDelete) {
      setSelectedResponse(null);
    }
  };

  const validateHttpCode = (code: string): boolean => {
    if (code === '') return true;
    const codeNum = parseInt(code, 10);
    return !isNaN(codeNum) && codeNum >= 100 && codeNum < 600;
  };

  const handleHttpCodeChange = (code: string) => {
    // Allow typing numbers and backspace
    if (code === '' || /^\d{0,3}$/.test(code)) {
      updateResponse({ ...selectedResponse!, code });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Response Codes</h3>
        <button
          onClick={addResponse}
          className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
        >
          <Plus className="w-4 h-4" />
          Add Response
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1 border rounded-lg overflow-hidden">
          <div className="max-h-[400px] overflow-y-auto">
            {responses.map((response, index) => (
              <div
                key={index}
                className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedResponse === response ? 'bg-blue-50' : ''
                }`}
                onClick={() => setSelectedResponse(response)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">{response.code || 'New Response'}</span>
                    <p className="text-sm text-gray-500 truncate">
                      {response.description || 'No description'}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteResponse(response);
                    }}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-2">
          {selectedResponse ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    HTTP Code
                  </label>
                  <input
                    type="text"
                    value={selectedResponse.code}
                    onChange={(e) => handleHttpCodeChange(e.target.value)}
                    placeholder="e.g., 200"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    maxLength={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={selectedResponse.description}
                    onChange={(e) =>
                      updateResponse({
                        ...selectedResponse,
                        description: e.target.value,
                      })
                    }
                    placeholder="Response description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Response Body
                </label>
                <Editor
                  height="300px"
                  defaultLanguage="json"
                  value={selectedResponse.content}
                  onChange={(value) =>
                    updateResponse({
                      ...selectedResponse,
                      content: value || '{}',
                    })
                  }
                  options={{
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    formatOnPaste: true,
                    formatOnType: true,
                  }}
                />
                {error && (
                  <div className="mt-2 text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Select a response or add a new one
            </div>
          )}
        </div>
      </div>
    </div>
  );
}