import React, { useState, useRef } from 'react';
import { Resume } from '../types/resume';
import { 
  FileText, 
  Upload, 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  List,
  ListOrdered,
  Type,
  Image,
  Save,
  Download,
  Wand2
} from 'lucide-react';

interface WordLikeEditorProps {
  resume: Resume;
  onUpdateResume: (updates: Partial<Resume>) => void;
  onGetAISuggestions: () => void;
  isGeneratingSuggestions: boolean;
}

export const WordLikeEditor: React.FC<WordLikeEditorProps> = ({
  resume,
  onUpdateResume,
  onGetAISuggestions,
  isGeneratingSuggestions
}) => {
  const [selectedFont, setSelectedFont] = useState('Arial');
  const [fontSize, setFontSize] = useState('12');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const fonts = [
    'Arial', 'Times New Roman', 'Calibri', 'Helvetica', 'Georgia', 
    'Verdana', 'Tahoma', 'Trebuchet MS', 'Garamond'
  ];

  const fontSizes = ['8', '9', '10', '11', '12', '14', '16', '18', '20', '24', '28', '32'];

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const photoUrl = e.target?.result as string;
        onUpdateResume({
          personalInfo: {
            ...resume.personalInfo,
            photo: photoUrl
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const insertTemplate = () => {
    const template = `
<div style="font-family: ${selectedFont}; font-size: ${fontSize}px; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 40px;">
  
  <!-- Header Section -->
  <div style="text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px;">
    ${resume.personalInfo.photo ? `
    <div style="margin-bottom: 20px;">
      <img src="${resume.personalInfo.photo}" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 3px solid #2563eb;" alt="Profile Photo">
    </div>
    ` : ''}
    <h1 style="margin: 0; font-size: 32px; color: #1f2937; font-weight: bold;">${resume.personalInfo.fullName || '[Your Full Name]'}</h1>
    <div style="margin-top: 10px; color: #6b7280; font-size: 14px;">
      ${resume.personalInfo.email ? `📧 ${resume.personalInfo.email}` : '📧 [Your Email]'} | 
      ${resume.personalInfo.phone ? `📱 ${resume.personalInfo.phone}` : '📱 [Your Phone]'} | 
      ${resume.personalInfo.location ? `📍 ${resume.personalInfo.location}` : '📍 [Your Location]'}
    </div>
    ${resume.personalInfo.linkedin ? `<div style="margin-top: 5px; color: #2563eb;">🔗 ${resume.personalInfo.linkedin}</div>` : ''}
  </div>

  <!-- Professional Summary -->
  <div style="margin-bottom: 30px;">
    <h2 style="color: #2563eb; font-size: 20px; margin-bottom: 15px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">
      💼 PROFESSIONAL SUMMARY
    </h2>
    <p style="margin: 0; text-align: justify; color: #374151;">
      ${resume.personalInfo.summary || 'Write a compelling 2-3 sentence summary highlighting your key achievements, skills, and career objectives. Focus on what makes you unique and valuable to potential employers.'}
    </p>
  </div>

  <!-- Work Experience -->
  <div style="margin-bottom: 30px;">
    <h2 style="color: #2563eb; font-size: 20px; margin-bottom: 15px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">
      🏢 WORK EXPERIENCE
    </h2>
    ${resume.experience.length > 0 ? resume.experience.map(exp => `
    <div style="margin-bottom: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
        <div>
          <h3 style="margin: 0; font-size: 16px; font-weight: bold; color: #1f2937;">${exp.position}</h3>
          <p style="margin: 2px 0; color: #2563eb; font-weight: 500;">${exp.company}</p>
        </div>
        <div style="text-align: right; color: #6b7280; font-size: 14px;">
          <div>${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</div>
          ${exp.location ? `<div>${exp.location}</div>` : ''}
        </div>
      </div>
      ${exp.description ? `<div style="color: #374151; margin-left: 0; white-space: pre-line;">${exp.description}</div>` : ''}
    </div>
    `).join('') : `
    <div style="margin-bottom: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
        <div>
          <h3 style="margin: 0; font-size: 16px; font-weight: bold; color: #1f2937;">[Job Title]</h3>
          <p style="margin: 2px 0; color: #2563eb; font-weight: 500;">[Company Name]</p>
        </div>
        <div style="text-align: right; color: #6b7280; font-size: 14px;">
          <div>[Start Date] - [End Date]</div>
          <div>[Location]</div>
        </div>
      </div>
      <div style="color: #374151;">
        • Key achievement or responsibility<br>
        • Another important accomplishment<br>
        • Quantifiable result or impact
      </div>
    </div>
    `}
  </div>

  <!-- Education -->
  <div style="margin-bottom: 30px;">
    <h2 style="color: #2563eb; font-size: 20px; margin-bottom: 15px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">
      🎓 EDUCATION
    </h2>
    ${resume.education.length > 0 ? resume.education.map(edu => `
    <div style="margin-bottom: 15px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <h3 style="margin: 0; font-size: 16px; font-weight: bold; color: #1f2937;">${edu.degree} in ${edu.field}</h3>
          <p style="margin: 2px 0; color: #2563eb; font-weight: 500;">${edu.institution}</p>
        </div>
        <div style="text-align: right; color: #6b7280; font-size: 14px;">
          <div>${edu.graduationDate}</div>
          ${edu.gpa ? `<div>GPA: ${edu.gpa}</div>` : ''}
        </div>
      </div>
      ${edu.description ? `<div style="color: #374151; margin-top: 5px;">${edu.description}</div>` : ''}
    </div>
    `).join('') : `
    <div style="margin-bottom: 15px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <h3 style="margin: 0; font-size: 16px; font-weight: bold; color: #1f2937;">[Degree] in [Field of Study]</h3>
          <p style="margin: 2px 0; color: #2563eb; font-weight: 500;">[University/Institution Name]</p>
        </div>
        <div style="text-align: right; color: #6b7280; font-size: 14px;">
          <div>[Graduation Date]</div>
          <div>GPA: [X.X/4.0]</div>
        </div>
      </div>
    </div>
    `}
  </div>

  <!-- Skills -->
  <div style="margin-bottom: 30px;">
    <h2 style="color: #2563eb; font-size: 20px; margin-bottom: 15px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">
      🛠️ SKILLS
    </h2>
    ${resume.skills.length > 0 ? `
    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
      ${resume.skills.map(skill => `
        <span style="background: #eff6ff; color: #2563eb; padding: 6px 12px; border-radius: 20px; font-size: 14px; font-weight: 500;">
          ${skill.name} (${skill.level})
        </span>
      `).join('')}
    </div>
    ` : `
    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
      <span style="background: #eff6ff; color: #2563eb; padding: 6px 12px; border-radius: 20px; font-size: 14px; font-weight: 500;">JavaScript (Advanced)</span>
      <span style="background: #eff6ff; color: #2563eb; padding: 6px 12px; border-radius: 20px; font-size: 14px; font-weight: 500;">React (Expert)</span>
      <span style="background: #eff6ff; color: #2563eb; padding: 6px 12px; border-radius: 20px; font-size: 14px; font-weight: 500;">Project Management (Intermediate)</span>
      <span style="background: #eff6ff; color: #2563eb; padding: 6px 12px; border-radius: 20px; font-size: 14px; font-weight: 500;">Communication (Advanced)</span>
    </div>
    `}
  </div>

  <!-- Additional Sections (Optional) -->
  <div style="margin-bottom: 30px;">
    <h2 style="color: #2563eb; font-size: 20px; margin-bottom: 15px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">
      🏆 ADDITIONAL INFORMATION
    </h2>
    <div style="color: #374151;">
      <p><strong>Languages:</strong> English (Native), Spanish (Conversational)</p>
      <p><strong>Certifications:</strong> Add any relevant certifications here</p>
      <p><strong>Interests:</strong> Add hobbies or interests that show personality</p>
    </div>
  </div>

</div>
    `;

    if (editorRef.current) {
      editorRef.current.innerHTML = template;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Word-like CV Editor</h2>
            <p className="text-sm text-gray-600">Create your CV like in Microsoft Word</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onGetAISuggestions}
            disabled={isGeneratingSuggestions}
            className="flex items-center space-x-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 text-sm"
          >
            <Wand2 className="w-4 h-4" />
            <span>{isGeneratingSuggestions ? 'Analyzing...' : 'AI Improve'}</span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-wrap items-center gap-4">
          {/* Font Selection */}
          <div className="flex items-center space-x-2">
            <select
              value={selectedFont}
              onChange={(e) => setSelectedFont(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {fonts.map(font => (
                <option key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </option>
              ))}
            </select>
            
            <select
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {fontSizes.map(size => (
                <option key={size} value={size}>{size}pt</option>
              ))}
            </select>
          </div>

          {/* Formatting Buttons */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => formatText('bold')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => formatText('italic')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => formatText('underline')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Underline"
            >
              <Underline className="w-4 h-4" />
            </button>
          </div>

          {/* Alignment */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => formatText('justifyLeft')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Align Left"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => formatText('justifyCenter')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Align Center"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              onClick={() => formatText('justifyRight')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Align Right"
            >
              <AlignRight className="w-4 h-4" />
            </button>
          </div>

          {/* Lists */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => formatText('insertUnorderedList')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => formatText('insertOrderedList')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
          </div>

          {/* Photo Upload */}
          <div className="flex items-center space-x-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              <Upload className="w-4 h-4" />
              <span>Add Photo</span>
            </button>
          </div>

          {/* Insert Template */}
          <button
            onClick={insertTemplate}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Type className="w-4 h-4" />
            <span>Insert Template</span>
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="p-6">
        <div
          ref={editorRef}
          contentEditable
          className="min-h-[800px] w-full border border-gray-300 rounded-lg p-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          style={{
            fontFamily: selectedFont,
            fontSize: `${fontSize}px`,
            lineHeight: '1.6',
            maxWidth: '800px',
            margin: '0 auto',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
          suppressContentEditableWarning={true}
          placeholder="Start typing your CV here or click 'Insert Template' to begin with a professional template..."
        />
      </div>

      {/* Instructions */}
      <div className="p-4 bg-blue-50 border-t border-blue-200">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">How to use the Word-like Editor:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>Click "Insert Template" to start with a professional CV template</li>
              <li>Upload your photo using the "Add Photo" button</li>
              <li>Edit text directly in the document - just like Microsoft Word</li>
              <li>Use the formatting toolbar to style your text</li>
              <li>The AI will analyze your content and suggest improvements</li>
              <li>Export to PDF when you're satisfied with your CV</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};