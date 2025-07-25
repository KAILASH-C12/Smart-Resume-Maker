import React from 'react';
import { Resume } from '../types/resume';
import { MapPin, Phone, Mail, Globe, Linkedin } from 'lucide-react';

interface ResumePreviewProps {
  resume: Resume;
  className?: string;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ resume, className = '' }) => {
  const { personalInfo, experience, education, skills } = resume;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  const getSkillsByCategory = () => {
    return skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, typeof skills>);
  };

  const skillsByCategory = getSkillsByCategory();

  const getTemplateStyles = () => {
    switch (resume.template) {
      case 'classic':
        return {
          headerBg: 'bg-gray-900',
          headerText: 'text-white',
          accentColor: 'border-gray-900',
          skillBg: 'bg-gray-100 text-gray-800'
        };
      case 'minimal':
        return {
          headerBg: 'bg-white border-b-2 border-gray-300',
          headerText: 'text-gray-900',
          accentColor: 'border-gray-400',
          skillBg: 'bg-gray-50 text-gray-700'
        };
      case 'creative':
        return {
          headerBg: 'bg-gradient-to-r from-purple-600 to-pink-600',
          headerText: 'text-white',
          accentColor: 'border-purple-600',
          skillBg: 'bg-purple-100 text-purple-800'
        };
      default: // modern
        return {
          headerBg: 'bg-gradient-to-r from-blue-600 to-indigo-700',
          headerText: 'text-white',
          accentColor: 'border-blue-600',
          skillBg: 'bg-blue-100 text-blue-800'
        };
    }
  };

  const styles = getTemplateStyles();
  return (
    <div className={`bg-white ${className}`}>
      <div 
        id="resume-preview" 
        className="max-w-4xl mx-auto bg-white text-gray-900 print:shadow-none print:max-w-none print:mx-0"
        style={{ minHeight: '11in', fontFamily: 'system-ui, -apple-system, sans-serif' }}
      >
        {/* Header */}
        <div className={`${styles.headerBg} ${styles.headerText} p-8`}>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">{personalInfo.fullName || 'Your Name'}</h1>
            
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm">
              {personalInfo.email && (
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  <span>{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{personalInfo.location}</span>
                </div>
              )}
              {personalInfo.website && (
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  <span>{personalInfo.website}</span>
                </div>
              )}
              {personalInfo.linkedin && (
                <div className="flex items-center gap-1">
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Professional Summary */}
          {personalInfo.summary && (
            <section>
              <h2 className={`text-xl font-bold text-gray-900 border-b-2 ${styles.accentColor} pb-2 mb-4`}>
                Professional Summary
              </h2>
              <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
            </section>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <section>
              <h2 className={`text-xl font-bold text-gray-900 border-b-2 ${styles.accentColor} pb-2 mb-4`}>
                Professional Experience
              </h2>
              <div className="space-y-6">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                        <p className={`font-medium ${resume.template === 'minimal' ? 'text-gray-700' : resume.template === 'creative' ? 'text-purple-600' : resume.template === 'classic' ? 'text-gray-900' : 'text-blue-600'}`}>{exp.company}</p>
                      </div>
                      <div className="text-right text-gray-600">
                        <p>{formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}</p>
                        {exp.location && <p className="text-sm">{exp.location}</p>}
                      </div>
                    </div>
                    {exp.description && (
                      <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                        {exp.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section>
              <h2 className={`text-xl font-bold text-gray-900 border-b-2 ${styles.accentColor} pb-2 mb-4`}>
                Education
              </h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {edu.degree} in {edu.field}
                        </h3>
                        <p className={`font-medium ${resume.template === 'minimal' ? 'text-gray-700' : resume.template === 'creative' ? 'text-purple-600' : resume.template === 'classic' ? 'text-gray-900' : 'text-blue-600'}`}>{edu.institution}</p>
                      </div>
                      <div className="text-right text-gray-600">
                        <p>{formatDate(edu.graduationDate)}</p>
                        {edu.gpa && <p className="text-sm">GPA: {edu.gpa}</p>}
                      </div>
                    </div>
                    {edu.description && (
                      <p className="text-gray-700 leading-relaxed">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <section>
              <h2 className={`text-xl font-bold text-gray-900 border-b-2 ${styles.accentColor} pb-2 mb-4`}>
                Skills
              </h2>
              <div className="space-y-4">
                {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                  <div key={category}>
                    <h3 className="font-semibold text-gray-900 mb-2">{category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {categorySkills.map((skill) => (
                        <span 
                          key={skill.id}
                          className={`px-3 py-1 ${styles.skillBg} rounded-full text-sm font-medium`}
                        >
                          {skill.name} ({skill.level})
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};