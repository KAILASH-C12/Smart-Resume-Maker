import { Resume, AISuggestion } from '../types/resume';

// Simulated AI service - replace with actual OpenAI API calls
export class AIService {
  private static apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  static async getSuggestions(resume: Resume): Promise<AISuggestion[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock suggestions based on resume content
    const suggestions: AISuggestion[] = [];

    // Check personal summary
    if (!resume.personalInfo.summary || resume.personalInfo.summary.length < 50) {
      suggestions.push({
        section: 'Personal Summary',
        type: 'improvement',
        priority: 'high',
        category: 'content',
        suggestion: 'Add a compelling professional summary that highlights your key achievements and career goals.',
        improved: this.generateImprovedSummary(resume)
      });
    }

    // Check for keywords optimization
    if (this.needsKeywordOptimization(resume)) {
      suggestions.push({
        section: 'Keywords',
        type: 'improvement',
        priority: 'high',
        category: 'keywords',
        suggestion: 'Add industry-relevant keywords to improve ATS (Applicant Tracking System) compatibility.',
        improved: 'Consider adding keywords like: "project management", "cross-functional collaboration", "data analysis", "process optimization"'
      });
    }

    // Check resume length
    const totalContent = this.calculateContentLength(resume);
    if (totalContent < 300) {
      suggestions.push({
        section: 'Overall Content',
        type: 'addition',
        priority: 'medium',
        category: 'content',
        suggestion: 'Your resume appears to be quite brief. Consider adding more details about your achievements and responsibilities.'
      });
    }

    // Check experience descriptions
    resume.experience.forEach((exp, index) => {
      if (!exp.description || exp.description.length < 100) {
        suggestions.push({
          section: `Experience - ${exp.position}`,
          type: 'improvement',
          priority: 'high',
          category: 'content',
          suggestion: `Expand the description for ${exp.position} to include specific achievements and quantifiable results.`,
          original: exp.description,
          improved: this.generateImprovedExperience(exp)
        });
      }

      // Check for action verbs
      if (exp.description && !this.hasActionVerbs(exp.description)) {
        suggestions.push({
          section: `Experience - ${exp.position}`,
          type: 'improvement',
          priority: 'medium',
          category: 'content',
          suggestion: 'Use strong action verbs like "Led," "Developed," "Implemented," or "Optimized" to make your achievements more impactful.',
          original: exp.description
        });
      }
    });

    // Check skills relevance
    if (resume.skills.length < 5) {
      suggestions.push({
        section: 'Skills',
        type: 'addition',
        priority: 'medium',
        category: 'content',
        suggestion: 'Consider adding more relevant technical skills and soft skills to showcase your expertise.',
        improved: this.suggestRelevantSkills(resume)
      });
    }

    // Check for quantifiable achievements
    if (!this.hasQuantifiableAchievements(resume)) {
      suggestions.push({
        section: 'Achievements',
        type: 'improvement',
        priority: 'high',
        category: 'content',
        suggestion: 'Add specific numbers and metrics to quantify your achievements (e.g., "increased sales by 25%", "managed team of 10").',
        improved: 'Examples: "Increased team productivity by 30%", "Reduced processing time by 2 hours daily", "Managed budget of $500K"'
      });
    }

    // Check education
    if (resume.education.length === 0) {
      suggestions.push({
        section: 'Education',
        type: 'addition',
        priority: 'low',
        category: 'content',
        suggestion: 'Include your educational background, certifications, or relevant coursework to strengthen your profile.'
      });
    }

    return suggestions;
  }

  static async optimizeForATS(resume: Resume): Promise<AISuggestion[]> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const suggestions: AISuggestion[] = [];
    
    // ATS-specific suggestions
    suggestions.push({
      section: 'ATS Optimization',
      type: 'formatting',
      priority: 'high',
      category: 'structure',
      suggestion: 'Use standard section headings like "Work Experience", "Education", "Skills" for better ATS parsing.',
      improved: 'Recommended headings: Professional Experience, Education, Technical Skills, Core Competencies'
    });
    
    return suggestions;
  }

  static async enhanceWithIndustryKeywords(resume: Resume, industry: string): Promise<AISuggestion[]> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const keywordSuggestions: Record<string, string[]> = {
      'technology': ['agile', 'scrum', 'CI/CD', 'cloud computing', 'API development', 'microservices'],
      'marketing': ['digital marketing', 'SEO', 'content strategy', 'brand management', 'analytics', 'conversion optimization'],
      'finance': ['financial analysis', 'risk management', 'compliance', 'budgeting', 'forecasting', 'audit'],
      'healthcare': ['patient care', 'clinical protocols', 'HIPAA compliance', 'medical records', 'quality assurance'],
      'education': ['curriculum development', 'student assessment', 'classroom management', 'educational technology']
    };
    
    const keywords = keywordSuggestions[industry.toLowerCase()] || keywordSuggestions['technology'];
    
    return [{
      section: 'Industry Keywords',
      type: 'improvement',
      priority: 'high',
      category: 'keywords',
      suggestion: `Add ${industry} industry keywords to improve relevance for recruiters and ATS systems.`,
      improved: `Consider incorporating: ${keywords.join(', ')}`
    }];
  }
  static async improveSectionContent(content: string, section: string): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock improvement based on section
    switch (section.toLowerCase()) {
      case 'summary':
        return 'Results-driven professional with expertise in developing innovative solutions and leading high-performing teams. Proven ability to drive business growth through strategic thinking and technical excellence.';
      case 'experience':
        return '• Spearheaded development of enterprise-level applications serving 100K+ users\n• Collaborated with stakeholders to define requirements and deliver solutions exceeding expectations\n• Mentored junior developers and established best practices that improved team productivity by 30%';
      default:
        return content;
    }
  }
  private static generateImprovedSummary(resume: Resume): string {
    const hasExperience = resume.experience.length > 0;
    const hasSkills = resume.skills.length > 0;
    
    if (hasExperience && hasSkills) {
      const primarySkill = resume.skills[0]?.name || 'technology';
      const yearsExp = resume.experience.length > 2 ? '5+' : '3+';
      return `Results-driven professional with ${yearsExp} years of experience in ${primarySkill} and related technologies. Proven track record of delivering high-quality solutions and driving business growth through innovative problem-solving and collaborative leadership.`;
    }
    
    return 'Motivated professional with strong analytical skills and a passion for continuous learning. Committed to delivering exceptional results and contributing to team success through dedication and innovative thinking.';
  }

  private static generateImprovedExperience(exp: any): string {
    const templates = [
      '• Spearheaded development of key features that improved user engagement by 35%\n• Collaborated with cross-functional teams to deliver projects ahead of schedule\n• Implemented best practices that reduced development time by 25%',
      '• Led strategic initiatives that resulted in 40% increase in operational efficiency\n• Managed stakeholder relationships and facilitated communication across departments\n• Developed and executed plans that exceeded quarterly targets by 20%',
      '• Designed and implemented solutions that enhanced system performance by 50%\n• Mentored junior team members and established coding standards\n• Optimized workflows that saved 15 hours per week in manual processes'
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
  }

  private static suggestRelevantSkills(resume: Resume): string {
    const skillSuggestions = [
      'Project Management, Team Leadership, Problem Solving, Communication',
      'Data Analysis, Process Optimization, Strategic Planning, Client Relations',
      'JavaScript, Python, SQL, Cloud Computing, Agile Methodology',
      'Digital Marketing, Content Creation, Analytics, Social Media Management'
    ];
    
    return `Consider adding: ${skillSuggestions[Math.floor(Math.random() * skillSuggestions.length)]}`;
  }

  private static needsKeywordOptimization(resume: Resume): boolean {
    const content = `${resume.personalInfo.summary} ${resume.experience.map(e => e.description).join(' ')}`.toLowerCase();
    const importantKeywords = ['project', 'team', 'develop', 'manage', 'lead', 'improve', 'implement'];
    return importantKeywords.filter(keyword => content.includes(keyword)).length < 3;
  }

  private static calculateContentLength(resume: Resume): number {
    return (resume.personalInfo.summary?.length || 0) +
           resume.experience.reduce((acc, exp) => acc + (exp.description?.length || 0), 0) +
           resume.education.reduce((acc, edu) => acc + (edu.description?.length || 0), 0);
  }

  private static hasQuantifiableAchievements(resume: Resume): boolean {
    const content = `${resume.personalInfo.summary} ${resume.experience.map(e => e.description).join(' ')}`;
    const numberPattern = /\d+[%$]?|\b(increased|decreased|improved|reduced|saved|managed|led)\s+.*?\d+/i;
    return numberPattern.test(content);
  }

  private static hasActionVerbs(text: string): boolean {
    const actionVerbs = ['led', 'developed', 'implemented', 'created', 'managed', 'optimized', 'designed', 'built', 'established', 'achieved'];
    return actionVerbs.some(verb => text.toLowerCase().includes(verb));
  }
}