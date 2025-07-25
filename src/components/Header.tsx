import React from 'react';
import { FileText, Download, Save, Plus, Brain } from 'lucide-react';

interface HeaderProps {
  onSave: () => void;
  onExportPDF: () => void;
  onNewResume: () => void;
  onGetSuggestions: () => void;
  isSaving: boolean;
  isExporting: boolean;
  isGeneratingSuggestions: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onSave,
  onExportPDF,
  onNewResume,
  onGetSuggestions,
  isSaving,
  isExporting,
  isGeneratingSuggestions
}) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Smart Resume Builder</h1>
            <p className="text-sm text-gray-500">AI-Powered Resume Creation</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onGetSuggestions}
            disabled={isGeneratingSuggestions}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Brain className="w-4 h-4" />
            <span>{isGeneratingSuggestions ? 'Analyzing...' : 'AI Suggestions'}</span>
          </button>

          <button
            onClick={onNewResume}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Resume</span>
          </button>

          <button
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save'}</span>
          </button>

          <button
            onClick={onExportPDF}
            disabled={isExporting}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Exporting...' : 'Export PDF'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};