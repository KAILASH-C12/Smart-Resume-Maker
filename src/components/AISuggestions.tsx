import React from 'react';
import { Brain, CheckCircle, AlertTriangle, PlusCircle, X, Zap, Target, FileText, Search } from 'lucide-react';
import { AISuggestion } from '../types/resume';

interface AISuggestionsProps {
  suggestions: AISuggestion[];
  isVisible: boolean;
  onClose: () => void;
  onApplySuggestion: (suggestion: AISuggestion) => void;
  onOptimizeForATS: () => void;
  onEnhanceKeywords: () => void;
  isOptimizing: boolean;
}

export const AISuggestions: React.FC<AISuggestionsProps> = ({
  suggestions,
  isVisible,
  onClose,
  onApplySuggestion,
  onOptimizeForATS,
  onEnhanceKeywords,
  isOptimizing
}) => {
  if (!isVisible) return null;

  const getIcon = (type: AISuggestion['type']) => {
    switch (type) {
      case 'improvement':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'addition':
        return <PlusCircle className="w-5 h-5 text-green-600" />;
      case 'formatting':
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
    }
  };

  const getCategoryIcon = (category: AISuggestion['category']) => {
    switch (category) {
      case 'content':
        return <FileText className="w-4 h-4" />;
      case 'keywords':
        return <Search className="w-4 h-4" />;
      case 'structure':
        return <Target className="w-4 h-4" />;
      case 'formatting':
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: AISuggestion['type']) => {
    switch (type) {
      case 'improvement':
        return 'bg-yellow-50 border-yellow-200';
      case 'addition':
        return 'bg-green-50 border-green-200';
      case 'formatting':
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getPriorityColor = (priority: AISuggestion['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getTypeLabel = (type: AISuggestion['type']) => {
    switch (type) {
      case 'improvement':
        return 'Improvement';
      case 'addition':
        return 'Addition';
      case 'formatting':
        return 'Formatting';
    }
  };

  const groupedSuggestions = suggestions.reduce((acc, suggestion) => {
    if (!acc[suggestion.priority]) {
      acc[suggestion.priority] = [];
    }
    acc[suggestion.priority].push(suggestion);
    return acc;
  }, {} as Record<string, AISuggestion[]>);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">AI Suggestions</h2>
              <p className="text-sm text-gray-600">
                {suggestions.length} suggestions to improve your resume
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onOptimizeForATS}
              disabled={isOptimizing}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
            >
              <Target className="w-4 h-4" />
              <span>ATS Optimize</span>
            </button>
            
            <button
              onClick={onEnhanceKeywords}
              disabled={isOptimizing}
              className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 text-sm"
            >
              <Search className="w-4 h-4" />
              <span>Keywords</span>
            </button>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {suggestions.length === 0 ? (
            <div className="text-center py-12">
              <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Great Work!</h3>
              <p className="text-gray-600">
                Your resume looks good. No specific suggestions at this time.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {(['high', 'medium', 'low'] as const).map(priority => {
                const prioritySuggestions = groupedSuggestions[priority];
                if (!prioritySuggestions?.length) return null;
                
                return (
                  <div key={priority}>
                    <div className="flex items-center space-x-2 mb-4">
                      <Zap className={`w-5 h-5 ${priority === 'high' ? 'text-red-500' : priority === 'medium' ? 'text-yellow-500' : 'text-green-500'}`} />
                      <h3 className="font-semibold text-gray-900 capitalize">{priority} Priority</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(priority)}`}>
                        {prioritySuggestions.length} suggestion{prioritySuggestions.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    <div className="space-y-4">
                      {prioritySuggestions.map((suggestion, index) => (
                        <div
                          key={`${priority}-${index}`}
                          className={`border rounded-lg p-4 ${getTypeColor(suggestion.type)}`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              {getIcon(suggestion.type)}
                              <span className="font-medium text-gray-900">
                                {suggestion.section}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                suggestion.type === 'improvement' ? 'bg-yellow-100 text-yellow-800' :
                                suggestion.type === 'addition' ? 'bg-green-100 text-green-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {getTypeLabel(suggestion.type)}
                              </span>
                              <div className="flex items-center space-x-1 text-gray-500">
                                {getCategoryIcon(suggestion.category)}
                                <span className="text-xs capitalize">{suggestion.category}</span>
                              </div>
                            </div>
                          </div>

                          <p className="text-gray-700 mb-3">{suggestion.suggestion}</p>

                          {suggestion.original && (
                            <div className="mb-3">
                              <p className="text-sm font-medium text-gray-900 mb-1">Current:</p>
                              <div className="bg-gray-100 rounded p-3 text-sm text-gray-700 whitespace-pre-line">
                                {suggestion.original}
                              </div>
                            </div>
                          )}

                          {suggestion.improved && (
                            <div className="mb-3">
                              <p className="text-sm font-medium text-gray-900 mb-1">Suggested:</p>
                              <div className="bg-white rounded border p-3 text-sm text-gray-700 whitespace-pre-line">
                                {suggestion.improved}
                              </div>
                            </div>
                          )}

                          {suggestion.improved && (
                            <button
                              onClick={() => onApplySuggestion(suggestion)}
                              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                            >
                              Apply Suggestion
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};