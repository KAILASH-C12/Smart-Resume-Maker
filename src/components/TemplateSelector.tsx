import React from 'react';
import { Resume } from '../types/resume';
import { Palette, FileText, Minimize, Sparkles } from 'lucide-react';

interface TemplateSelectorProps {
  selectedTemplate: Resume['template'];
  onTemplateChange: (template: Resume['template']) => void;
}

const templates = [
  {
    id: 'modern' as const,
    name: 'Modern',
    description: 'Clean design with blue accents',
    icon: FileText,
    preview: 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'
  },
  {
    id: 'classic' as const,
    name: 'Classic',
    description: 'Traditional black and white',
    icon: FileText,
    preview: 'bg-gray-50 border-gray-300'
  },
  {
    id: 'minimal' as const,
    name: 'Minimal',
    description: 'Simple and clean layout',
    icon: Minimize,
    preview: 'bg-white border-gray-200'
  },
  {
    id: 'creative' as const,
    name: 'Creative',
    description: 'Colorful and dynamic',
    icon: Sparkles,
    preview: 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200'
  }
];

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateChange
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
          <Palette className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Choose Template</h2>
          <p className="text-sm text-gray-600">Select a design that fits your style</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {templates.map((template) => {
          const Icon = template.icon;
          const isSelected = selectedTemplate === template.id;
          
          return (
            <button
              key={template.id}
              onClick={() => onTemplateChange(template.id)}
              className={`relative p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                isSelected 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`w-full h-24 rounded-md mb-3 ${template.preview} flex items-center justify-center`}>
                <Icon className={`w-8 h-8 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
              </div>
              
              <h3 className={`font-medium mb-1 ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                {template.name}
              </h3>
              <p className="text-xs text-gray-600">{template.description}</p>
              
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};