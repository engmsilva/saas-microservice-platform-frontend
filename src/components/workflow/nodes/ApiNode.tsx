import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Server, ChevronDown, ChevronUp, Lock, Unlock, Plus, X } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { ResponseManager } from './api/ResponseManager';
import { useTheme } from '../../../contexts/ThemeContext';

interface FormParam {
  key: string;
  value: string;
  type?: 'text' | 'file';
}

interface HttpResponse {
  code: string;
  description: string;
  content: string;
}

interface ApiNodeData {
  method: string;
  url: string;
  description: string;
  params: Array<{ key: string; value: string }>;
  headers: Array<{ key: string; value: string }>;
  body: {
    type: string;
    content: string;
    formData: FormParam[];
    urlEncoded: FormParam[];
  };
  auth: {
    type: string;
    token: string;
  };
  responses: HttpResponse[];
}

interface ApiNodeProps {
  data: ApiNodeData;
}

export function ApiNode({ data }: ApiNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('request');
  const [activeSection, setActiveSection] = useState('params');
  const [method, setMethod] = useState(data.method || 'GET');
  const [url, setUrl] = useState(data.url || '');
  const [description, setDescription] = useState(data.description || '');
  const [params, setParams] = useState(data.params || []);
  const [headers, setHeaders] = useState(data.headers || []);
  const [bodyType, setBodyType] = useState(data.body?.type || 'none');
  const [bodyContent, setBodyContent] = useState(data.body?.content || '');
  const [formData, setFormData] = useState<FormParam[]>(data.body?.formData || []);
  const [urlEncoded, setUrlEncoded] = useState<FormParam[]>(data.body?.urlEncoded || []);
  const [authType, setAuthType] = useState(data.auth?.type || 'none');
  const [authToken, setAuthToken] = useState(data.auth?.token || '');
  const [responses, setResponses] = useState<HttpResponse[]>(data.responses || []);
  const { theme } = useTheme();

  const addParam = () => {
    setParams([...params, { key: '', value: '' }]);
  };

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const addFormData = () => {
    setFormData([...formData, { key: '', value: '', type: 'text' }]);
  };

  const addUrlEncoded = () => {
    setUrlEncoded([...urlEncoded, { key: '', value: '' }]);
  };

  const removeFormData = (index: number) => {
    setFormData(formData.filter((_, i) => i !== index));
  };

  const removeUrlEncoded = (index: number) => {
    setUrlEncoded(urlEncoded.filter((_, i) => i !== index));
  };

  const handleResponseUpdate = (updatedResponses: HttpResponse[]) => {
    setResponses(updatedResponses);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-blue-500 min-w-[250px] relative">
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-500" />
            <span className="font-medium text-gray-900 dark:text-white">API</span>
          </div>
          <div className="flex items-center gap-2">
            {authType === 'none' ? (
              <Unlock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            ) : (
              <Lock className="w-4 h-4 text-blue-500" />
            )}
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
        </div>
        {!isExpanded && (
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            <div>{method} {url}</div>
            {description && <div className="text-xs mt-1">{description}</div>}
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="p-4">
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mb-4 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />

          <div className="flex gap-2 mb-4">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
              <option value="PATCH">PATCH</option>
            </select>
            <input
              type="text"
              placeholder="Enter URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
            <div className="flex gap-4">
              <button
                className={`px-4 py-2 border-b-2 ${
                  activeTab === 'request'
                    ? 'border-blue-500 text-blue-500'
                    : 'border-transparent text-gray-600 dark:text-gray-400'
                }`}
                onClick={() => setActiveTab('request')}
              >
                Request
              </button>
              <button
                className={`px-4 py-2 border-b-2 ${
                  activeTab === 'response'
                    ? 'border-blue-500 text-blue-500'
                    : 'border-transparent text-gray-600 dark:text-gray-400'
                }`}
                onClick={() => setActiveTab('response')}
              >
                Response
              </button>
            </div>
          </div>

          {activeTab === 'request' ? (
            <div>
              <div className="flex gap-2 mb-4 border-b border-gray-200 dark:border-gray-700">
                {['params', 'headers', 'body', 'auth'].map((section) => (
                  <button
                    key={section}
                    className={`px-4 py-2 ${
                      activeSection === section
                        ? 'text-blue-500 border-b-2 border-blue-500'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                    onClick={() => setActiveSection(section)}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </button>
                ))}
              </div>

              {activeSection === 'params' && (
                <div className="space-y-2">
                  {params.map((param, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Key"
                        value={param.key}
                        onChange={(e) => {
                          const newParams = [...params];
                          newParams[index].key = e.target.value;
                          setParams(newParams);
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="Value"
                        value={param.value}
                        onChange={(e) => {
                          const newParams = [...params];
                          newParams[index].value = e.target.value;
                          setParams(newParams);
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <button
                        onClick={() => {
                          const newParams = [...params];
                          newParams.splice(index, 1);
                          setParams(newParams);
                        }}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addParam}
                    className="flex items-center gap-1 text-blue-500 text-sm hover:text-blue-600"
                  >
                    <Plus className="w-4 h-4" />
                    Add Parameter
                  </button>
                </div>
              )}

              {activeSection === 'headers' && (
                <div className="space-y-2">
                  {headers.map((header, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Key"
                        value={header.key}
                        onChange={(e) => {
                          const newHeaders = [...headers];
                          newHeaders[index].key = e.target.value;
                          setHeaders(newHeaders);
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="Value"
                        value={header.value}
                        onChange={(e) => {
                          const newHeaders = [...headers];
                          newHeaders[index].value = e.target.value;
                          setHeaders(newHeaders);
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <button
                        onClick={() => {
                          const newHeaders = [...headers];
                          newHeaders.splice(index, 1);
                          setHeaders(newHeaders);
                        }}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addHeader}
                    className="flex items-center gap-1 text-blue-500 text-sm hover:text-blue-600"
                  >
                    <Plus className="w-4 h-4" />
                    Add Header
                  </button>
                </div>
              )}

              {activeSection === 'body' && (
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
                          <input
                            type={item.type === 'file' ? 'file' : 'text'}
                            placeholder="Value"
                            onChange={(e) => {
                              const newFormData = [...formData];
                              newFormData[index].value = e.target.value;
                              setFormData(newFormData);
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                          <button
                            onClick={() => removeFormData(index)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                          >
                            <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={addFormData}
                        className="flex items-center gap-1 text-blue-500 text-sm hover:text-blue-600"
                      >
                        <Plus className="w-4 h-4" />
                        Add Form Data
                      </button>
                    </div>
                  )}

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
                          <button
                            onClick={() => removeUrlEncoded(index)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                          >
                            <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={addUrlEncoded}
                        className="flex items-center gap-1 text-blue-500 text-sm hover:text-blue-600"
                      >
                        <Plus className="w-4 h-4" />
                        Add URL Encoded
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeSection === 'auth' && (
                <div>
                  <select
                    value={authType}
                    onChange={(e) => setAuthType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md mb-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="none">No Authentication</option>
                    <option value="bearer">Bearer Token</option>
                    <option value="basic">Basic Auth</option>
                    <option value="oauth2">OAuth 2.0</option>
                  </select>
                  {authType === 'bearer' && (
                    <input
                      type="text"
                      placeholder="Bearer Token"
                      value={authToken}
                      onChange={(e) => setAuthToken(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  )}
                </div>
              )}
            </div>
          ) : (
            <ResponseManager responses={responses} onUpdate={handleResponseUpdate} />
          )}
        </div>
      )}

      <div className="absolute right-0 bottom-0 h-[60px] w-[16px] flex flex-col justify-end gap-3 pb-2">
        <Handle
          type="source"
          position={Position.Right}
          id="request"
          className="!w-4 !h-4 !bg-blue-500 !border-2 !border-white dark:!border-gray-800 hover:!bg-blue-600 transition-colors !rounded !right-[-8px]"
          style={{ bottom: '32px', right: '-8px', top: 'auto' }}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="response"
          className="!w-4 !h-4 !bg-green-500 !border-2 !border-white dark:!border-gray-800 hover:!bg-green-600 transition-colors !rounded !right-[-8px]"
          style={{ bottom: '8px', right: '-8px', top: 'auto' }}
        />
      </div>
    </div>
  );
}