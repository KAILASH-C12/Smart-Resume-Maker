import React, { useState } from 'react';
import { Header } from './components/Header';
import { TemplateSelector } from './components/TemplateSelector';
import { SimpleEditor } from './components/SimpleEditor';
import { WordLikeEditor } from './components/WordLikeEditor';
import { PersonalInfoForm } from './components/PersonalInfoForm';
import { ExperienceForm } from './components/ExperienceForm';
import { EducationForm } from './components/EducationForm';
import { SkillsForm } from './components/SkillsForm';
import { ResumePreview } from './components/ResumePreview';
import { AISuggestions } from './components/AISuggestions';
import { useResume } from './hooks/useResume';
import { AIService } from './services/aiService';
import { PDFService } from './services/pdfService';
import { AISuggestion } from './types/resume';

function App() {
  const {
    resume,
    saveResume,
    createNewResume,
    updatePersonalInfo,
    addExperience,
    updateExperience,
    removeExperience,
    addEducation,
    updateEducation,
    removeEducation,
    addSkill,
    updateSkill,
    removeSkill,
    updateTemplate
  } = useResume();

  const [activeTab, setActiveTab] = useState<'simple' | 'word' | 'advanced' | 'preview'>('simple');
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      saveResume();
      // Simulate save delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const filename = `${resume.personalInfo.fullName || 'resume'}_resume.pdf`;
      await PDFService.generatePDF('resume-preview', filename);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleGetSuggestions = async () => {
    setIsGeneratingSuggestions(true);
    try {
      const newSuggestions = await AIService.getSuggestions(resume);
      setSuggestions(newSuggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Failed to get suggestions:', error);
      alert('Failed to get AI suggestions. Please try again.');
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  const handleOptimizeForATS = async () => {
    setIsOptimizing(true);
    try {
      const atsSuggestions = await AIService.optimizeForATS(resume);
      setSuggestions(prev => [...prev, ...atsSuggestions]);
    } catch (error) {
      console.error('Failed to optimize for ATS:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleEnhanceKeywords = async () => {
    setIsOptimizing(true);
    try {
      const keywordSuggestions = await AIService.enhanceWithIndustryKeywords(resume, 'technology');
      setSuggestions(prev => [...prev, ...keywordSuggestions]);
    } catch (error) {
      console.error('Failed to enhance keywords:', error);
    } finally {
      setIsOptimizing(false);
    }
  };
  const handleApplySuggestion = (suggestion: AISuggestion) => {
    if (!suggestion.improved) return;

    // Apply suggestion based on section
    if (suggestion.section === 'Personal Summary') {
      updatePersonalInfo({ summary: suggestion.improved });
    }
    // Note: For a production app, you'd implement more sophisticated suggestion application logic

    // Remove applied suggestion
    setSuggestions(prev => prev.filter(s => s !== suggestion));
  };

  const handleUpdateResume = (updates: Partial<typeof resume>) => {
    if (updates.personalInfo) {
      Object.entries(updates.personalInfo).forEach(([key, value]) => {
        updatePersonalInfo({ [key]: value });
      });
    }
    if (updates.experience) {
      // For simple editor, replace all experience
      resume.experience.forEach(exp => removeExperience(exp.id));
      updates.experience.forEach(exp => addExperience(exp));
    }
    if (updates.education) {
      resume.education.forEach(edu => removeEducation(edu.id));
      updates.education.forEach(edu => addEducation(edu));
    }
    if (updates.skills) {
      resume.skills.forEach(skill => removeSkill(skill.id));
      updates.skills.forEach(skill => addSkill(skill));
    }
  };
  const tabs = [
    { id: 'simple' as const, label: 'Simple Editor', count: null },
    { id: 'word' as const, label: 'Word-like CV', count: null },
    { id: 'advanced' as const, label: 'Advanced Editor', count: null },
    { id: 'preview' as const, label: 'Preview', count: null }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onSave={handleSave}
        onExportPDF={handleExportPDF}
        onNewResume={createNewResume}
        onGetSuggestions={handleGetSuggestions}
        isSaving={isSaving}
        isExporting={isExporting}
        isGeneratingSuggestions={isGeneratingSuggestions}
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  {tab.count && (
                    <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {activeTab === 'simple' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <TemplateSelector
                selectedTemplate={resume.template}
                onTemplateChange={updateTemplate}
              />
              
              <SimpleEditor
                resume={resume}
                onUpdateResume={handleUpdateResume}
                onGetAISuggestions={handleGetSuggestions}
                isGeneratingSuggestions={isGeneratingSuggestions}
              />
            </div>

            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h3>
                <div className="border rounded-lg overflow-hidden" style={{ transform: 'scale(0.6)', transformOrigin: 'top left', width: '166.67%', height: '166.67%' }}>
                  <ResumePreview resume={resume} />
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'word' ? (
          <div className="max-w-6xl mx-auto">
            <WordLikeEditor
              resume={resume}
              onUpdateResume={handleUpdateResume}
              onGetAISuggestions={handleGetSuggestions}
              isGeneratingSuggestions={isGeneratingSuggestions}
            />
          </div>
        ) : activeTab === 'advanced' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Forms */}
            <div className="space-y-8">
              <TemplateSelector
                selectedTemplate={resume.template}
                onTemplateChange={updateTemplate}
              />
              
              <PersonalInfoForm
                personalInfo={resume.personalInfo}
                onChange={updatePersonalInfo}
              />
              
              <ExperienceForm
                experiences={resume.experience}
                onAdd={addExperience}
                onUpdate={updateExperience}
                onRemove={removeExperience}
              />
              
              <EducationForm
                education={resume.education}
                onAdd={addEducation}
                onUpdate={updateEducation}
                onRemove={removeEducation}
              />
              
              <SkillsForm
                skills={resume.skills}
                onAdd={addSkill}
                onUpdate={updateSkill}
                onRemove={removeSkill}
              />
            </div>

            {/* Live Preview */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h3>
                <div className="border rounded-lg overflow-hidden" style={{ transform: 'scale(0.6)', transformOrigin: 'top left', width: '166.67%', height: '166.67%' }}>
                  <ResumePreview resume={resume} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <ResumePreview resume={resume} />
          </div>
        )}
      </div>

      <AISuggestions
        suggestions={suggestions}
        isVisible={showSuggestions}
        onClose={() => setShowSuggestions(false)}
        onApplySuggestion={handleApplySuggestion}
        onOptimizeForATS={handleOptimizeForATS}
        onEnhanceKeywords={handleEnhanceKeywords}
        isOptimizing={isOptimizing}
      />
    </div>
  );
}

export default App;