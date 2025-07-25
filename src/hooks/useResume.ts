import { useState, useEffect } from 'react';
import { Resume, PersonalInfo, Experience, Education, Skill } from '../types/resume';

const STORAGE_KEY = 'smart-resume-builder';

const defaultPersonalInfo: PersonalInfo = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  website: '',
  linkedin: '',
  summary: ''
};

const defaultResume: Resume = {
  id: Date.now().toString(),
  personalInfo: defaultPersonalInfo,
  experience: [],
  education: [],
  skills: [],
  template: 'modern',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export const useResume = () => {
  const [resume, setResume] = useState<Resume>(defaultResume);
  const [savedResumes, setSavedResumes] = useState<Resume[]>([]);

  useEffect(() => {
    loadSavedResumes();
  }, []);

  const loadSavedResumes = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setSavedResumes(JSON.parse(saved));
    }
  };

  const saveResume = (resumeToSave: Resume = resume) => {
    const updated = {
      ...resumeToSave,
      updatedAt: new Date().toISOString()
    };
    
    const existing = savedResumes.findIndex(r => r.id === updated.id);
    let newSavedResumes;
    
    if (existing >= 0) {
      newSavedResumes = [...savedResumes];
      newSavedResumes[existing] = updated;
    } else {
      newSavedResumes = [...savedResumes, updated];
    }
    
    setSavedResumes(newSavedResumes);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSavedResumes));
    setResume(updated);
  };

  const loadResume = (resumeId: string) => {
    const found = savedResumes.find(r => r.id === resumeId);
    if (found) {
      setResume(found);
    }
  };

  const createNewResume = () => {
    const newResume: Resume = {
      ...defaultResume,
      id: Date.now().toString(),
      template: 'modern',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setResume(newResume);
  };

  const updateTemplate = (template: Resume['template']) => {
    setResume(prev => ({
      ...prev,
      template
    }));
  };
  const updatePersonalInfo = (info: Partial<PersonalInfo>) => {
    setResume(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...info }
    }));
  };

  const addExperience = (experience: Omit<Experience, 'id'>) => {
    const newExperience: Experience = {
      ...experience,
      id: Date.now().toString()
    };
    setResume(prev => ({
      ...prev,
      experience: [...prev.experience, newExperience]
    }));
  };

  const updateExperience = (id: string, updates: Partial<Experience>) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, ...updates } : exp
      )
    }));
  };

  const removeExperience = (id: string) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const addEducation = (education: Omit<Education, 'id'>) => {
    const newEducation: Education = {
      ...education,
      id: Date.now().toString()
    };
    setResume(prev => ({
      ...prev,
      education: [...prev.education, newEducation]
    }));
  };

  const updateEducation = (id: string, updates: Partial<Education>) => {
    setResume(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, ...updates } : edu
      )
    }));
  };

  const removeEducation = (id: string) => {
    setResume(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const addSkill = (skill: Omit<Skill, 'id'>) => {
    const newSkill: Skill = {
      ...skill,
      id: Date.now().toString()
    };
    setResume(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
  };

  const updateSkill = (id: string, updates: Partial<Skill>) => {
    setResume(prev => ({
      ...prev,
      skills: prev.skills.map(skill => 
        skill.id === id ? { ...skill, ...updates } : skill
      )
    }));
  };

  const removeSkill = (id: string) => {
    setResume(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id)
    }));
  };

  return {
    resume,
    savedResumes,
    saveResume,
    loadResume,
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
  };
};