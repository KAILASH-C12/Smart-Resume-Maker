export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  summary: string;
  photo?: string;
  dateOfBirth?: string;
  nationality?: string;
  maritalStatus?: string;
  languages?: string[];
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  graduationDate: string;
  gpa?: string;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: string;
}

export interface Resume {
  id: string;
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  template: 'modern' | 'classic' | 'minimal' | 'creative';
  createdAt: string;
  updatedAt: string;
}

export interface AISuggestion {
  section: string;
  type: 'improvement' | 'addition' | 'formatting';
  suggestion: string;
  original?: string;
  improved?: string;
  priority: 'high' | 'medium' | 'low';
  category: 'content' | 'formatting' | 'structure' | 'keywords';
}