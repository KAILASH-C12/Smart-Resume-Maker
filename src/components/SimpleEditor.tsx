import React, { useState } from 'react';
import { Resume } from '../types/resume';
import { FileText, Wand2, Save, Eye } from 'lucide-react';

interface SimpleEditorProps {
  resume: Resume;
  onUpdateResume: (updates: Partial<Resume>) => void;
  onGetAISuggestions: () => void;
  isGeneratingSuggestions: boolean;
}

export const SimpleEditor: React.FC<SimpleEditorProps> = ({
  resume,
  onUpdateResume,
  onGetAISuggestions,
  isGeneratingSuggestions
}) => {
  const [activeSection, setActiveSection] = useState<'personal' | 'experience' | 'education' | 'skills'>('personal');

  const sections = [
    { id: 'personal' as const, label: 'Personal Info', icon: FileText },
    { id: 'experience' as const, label: 'Experience', icon: FileText },
    { id: 'education' as const, label: 'Education', icon: FileText },
    { id: 'skills' as const, label: 'Skills', icon: FileText }
  ];

  const handlePersonalInfoChange = (field: string, value: string) => {
    onUpdateResume({
      personalInfo: {
        ...resume.personalInfo,
        [field]: value
      }
    });
  };

  const handleExperienceChange = (value: string) => {
    // Simple text-based experience editing
    const experiences = value.split('\n\n').filter(exp => exp.trim()).map((exp, index) => ({
      id: `exp-${index}`,
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: exp.trim()
    }));
    
    onUpdateResume({ experience: experiences });
  };

  const handleEducationChange = (value: string) => {
    const education = value.split('\n\n').filter(edu => edu.trim()).map((edu, index) => ({
      id: `edu-${index}`,
      institution: '',
      degree: '',
      field: '',
      graduationDate: '',
      description: edu.trim()
    }));
    
    onUpdateResume({ education });
  };

  const handleSkillsChange = (value: string) => {
    const skills = value.split(',').filter(skill => skill.trim()).map((skill, index) => ({
      id: `skill-${index}`,
      name: skill.trim(),
      level: 'Intermediate' as const,
      category: 'Technical'
    }));
    
    onUpdateResume({ skills });
  };

  const getExperienceText = () => {
    return resume.experience.map(exp => exp.description).join('\n\n');
  };

  const getEducationText = () => {
    return resume.education.map(edu => edu.description).join('\n\n');
  };

  const getSkillsText = () => {
    return resume.skills.map(skill => skill.name).join(', ');
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
            <FileText className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Simple Editor</h2>
            <p className="text-sm text-gray-600">Write your resume like a document</p>
          </div>
        </div>
        
        <button
          onClick={onGetAISuggestions}
          disabled={isGeneratingSuggestions}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          <Wand2 className="w-4 h-4" />
          <span>{isGeneratingSuggestions ? 'Analyzing...' : 'AI Improve'}</span>
        </button>
      </div>

      {/* Section Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeSection === section.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon className="w-4 h-4" />
                  <span>{section.label}</span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeSection === 'personal' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={resume.personalInfo.fullName}
                onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Your full name"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={resume.personalInfo.email}
                  onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={resume.personalInfo.phone}
                  onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Professional Summary</label>
              <textarea
                value={resume.personalInfo.summary}
                onChange={(e) => handlePersonalInfoChange('summary', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                placeholder="Write a brief summary about yourself, your experience, and career goals..."
              />
            </div>
          </div>
        )}

        {activeSection === 'experience' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Work Experience</label>
            <textarea
              value={getExperienceText()}
              onChange={(e) => handleExperienceChange(e.target.value)}
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none font-mono text-sm"
              placeholder="Software Engineer at Tech Company
• Developed web applications using React and Node.js
• Led a team of 5 developers on major projects
• Improved system performance by 40%

Marketing Manager at StartupCo
• Managed social media campaigns reaching 100K+ users
• Increased brand awareness by 60% through strategic initiatives
• Collaborated with cross-functional teams

(Separate different jobs with double line breaks)"
            />
            <p className="mt-2 text-sm text-gray-500">
              Write each job experience in a separate paragraph. Use bullet points (•) for achievements.
            </p>
          </div>
        )}

        {activeSection === 'education' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
            <textarea
              value={getEducationText()}
              onChange={(e) => handleEducationChange(e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none font-mono text-sm"
              placeholder="Bachelor of Science in Computer Science
University of California, Berkeley
Graduated: May 2020
GPA: 3.8/4.0
Relevant coursework: Data Structures, Algorithms, Software Engineering

Master of Business Administration
Stanford University
Graduated: June 2022
Concentration: Technology Management

(Separate different degrees with double line breaks)"
            />
            <p className="mt-2 text-sm text-gray-500">
              Write each degree in a separate paragraph with all relevant details.
            </p>
          </div>
        )}

        {activeSection === 'skills' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
            <textarea
              value={getSkillsText()}
              onChange={(e) => handleSkillsChange(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              placeholder="JavaScript, React, Node.js, Python, SQL, AWS, Docker, Git, Agile, Team Leadership, Project Management, Communication"
            />
            <p className="mt-2 text-sm text-gray-500">
              List your skills separated by commas. Include both technical and soft skills.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};