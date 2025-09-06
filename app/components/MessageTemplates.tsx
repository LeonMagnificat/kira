import React, { useState } from 'react';
import { messageTemplates, getTemplatesByCategory, fillTemplate, type MessageTemplate } from '~/data/messageTemplates';

interface MessageTemplatesProps {
  onSelectTemplate: (content: string) => void;
  onClose: () => void;
  groupType?: 'emergency' | 'case-discussion' | 'general' | 'department';
}

export function MessageTemplates({ onSelectTemplate, onClose, groupType }: MessageTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState<MessageTemplate['category']>('general');
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
  const [templateVariables, setTemplateVariables] = useState<Record<string, string>>({});

  const categories = [
    { key: 'emergency' as const, label: 'Emergency', icon: '🚨' },
    { key: 'case-discussion' as const, label: 'Case Discussion', icon: '🏥' },
    { key: 'handoff' as const, label: 'Handoff', icon: '🔄' },
    { key: 'general' as const, label: 'General', icon: '💬' }
  ];

  const templates = getTemplatesByCategory(selectedCategory);

  const extractVariables = (content: string): string[] => {
    const matches = content.match(/\[([^\]]+)\]/g);
    return matches ? matches.map(match => match.slice(1, -1)) : [];
  };

  const handleTemplateSelect = (template: MessageTemplate) => {
    setSelectedTemplate(template);
    const variables = extractVariables(template.content);
    const initialVariables: Record<string, string> = {};
    variables.forEach(variable => {
      initialVariables[variable] = '';
    });
    setTemplateVariables(initialVariables);
  };

  const handleUseTemplate = () => {
    if (!selectedTemplate) return;
    
    const filledContent = fillTemplate(selectedTemplate, templateVariables);
    onSelectTemplate(filledContent);
    onClose();
  };

  const handleVariableChange = (variable: string, value: string) => {
    setTemplateVariables(prev => ({
      ...prev,
      [variable]: value
    }));
  };

  const isTemplateComplete = () => {
    return Object.values(templateVariables).every(value => value.trim() !== '');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Message Templates</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex h-96">
          {/* Categories */}
          <div className="w-1/4 border-r border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Categories</h3>
            </div>
            <div className="p-2">
              {categories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => {
                    setSelectedCategory(category.key);
                    setSelectedTemplate(null);
                  }}
                  className={`w-full text-left p-3 rounded-lg mb-2 transition-colors ${
                    selectedCategory === category.key
                      ? 'bg-pink-100 text-pink-800 border border-pink-200'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span>{category.icon}</span>
                    <span className="text-sm font-medium">{category.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Templates */}
          <div className="w-1/2 border-r border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Templates</h3>
            </div>
            <div className="overflow-y-auto h-full p-2">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className={`w-full text-left p-3 rounded-lg mb-2 transition-colors ${
                    selectedTemplate?.id === template.id
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    <span className="text-lg">{template.icon}</span>
                    <div>
                      <p className="font-medium text-sm">{template.title}</p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {template.content}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Template Editor */}
          <div className="w-1/4">
            {selectedTemplate ? (
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Customize Template</h3>
                  <p className="text-sm text-gray-500 mt-1">{selectedTemplate.title}</p>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* Variables */}
                  {Object.keys(templateVariables).map((variable) => (
                    <div key={variable}>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        {variable.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                      </label>
                      <input
                        type="text"
                        value={templateVariables[variable]}
                        onChange={(e) => handleVariableChange(variable, e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-pink-500 focus:border-transparent"
                        placeholder={`Enter ${variable.toLowerCase()}`}
                      />
                    </div>
                  ))}

                  {/* Preview */}
                  <div className="mt-4">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Preview</label>
                    <div className="p-3 bg-gray-50 rounded-lg text-sm">
                      {fillTemplate(selectedTemplate, templateVariables)}
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-gray-200">
                  <button
                    onClick={handleUseTemplate}
                    disabled={!isTemplateComplete()}
                    className="w-full bg-pink-700 text-white py-2 px-4 rounded-lg hover:bg-pink-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    Use Template
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm">Select a template to customize</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}