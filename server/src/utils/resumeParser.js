/**
 * Candidate Resume Parser & Skill Extractor for MCA / CS Graduates
 */

const KNOWN_TECH_SKILLS = [
  'javascript', 'typescript', 'react', 'react.js', 'node', 'node.js', 'express', 'express.js',
  'python', 'django', 'flask', 'fastapi', 'java', 'spring', 'spring boot', 'c++', 'c#', '.net',
  'html', 'css', 'tailwind', 'bootstrap', 'sql', 'postgresql', 'mysql', 'mongodb', 'sqlite',
  'git', 'github', 'docker', 'kubernetes', 'aws', 'cloud', 'azure', 'gcp', 'rest api', 'graphql',
  'data structures', 'algorithms', 'dsa', 'machine learning', 'deep learning', 'ai', 'data science',
  'linux', 'redux', 'next.js', 'vue', 'vue.js', 'angular', 'php', 'laravel', 'flutter', 'dart'
];

const DEGREE_PATTERNS = [
  { degree: 'MCA (Master of Computer Applications)', regex: /\b(mca|master of computer applications)\b/i },
  { degree: 'B.Tech / B.E. (Computer Science / IT)', regex: /\b(b\.?tech|b\.?e\.?|bachelor of technology|computer science|information technology)\b/i },
  { degree: 'BCA (Bachelor of Computer Applications)', regex: /\b(bca|bachelor of computer applications)\b/i },
  { degree: 'M.Tech / M.E.', regex: /\b(m\.?tech|m\.?e\.?)\b/i },
  { degree: 'B.Sc Computer Science', regex: /\b(b\.?sc computer science|b\.?sc cs|bsc cs)\b/i }
];

/**
 * Parses raw text from a candidate resume or text input
 * @param {string} text 
 */
function parseResumeText(text = '') {
  const cleanText = text.toLowerCase();

  // Extract skills
  const extractedSkills = KNOWN_TECH_SKILLS.filter(skill => {
    const regex = new RegExp(`\\b${skill.replace('.', '\\.')}\\b`, 'i');
    return regex.test(cleanText);
  });

  // Unique capital case skills
  const uniqueSkills = Array.from(new Set(extractedSkills.map(s => {
    if (s === 'react.js' || s === 'react') return 'React';
    if (s === 'node.js' || s === 'node') return 'Node.js';
    if (s === 'express.js' || s === 'express') return 'Express.js';
    if (s === 'javascript') return 'JavaScript';
    if (s === 'typescript') return 'TypeScript';
    if (s === 'python') return 'Python';
    if (s === 'java') return 'Java';
    if (s === 'c++') return 'C++';
    if (s === 'sql') return 'SQL';
    if (s === 'mongodb') return 'MongoDB';
    if (s === 'postgresql') return 'PostgreSQL';
    if (s === 'docker') return 'Docker';
    if (s === 'aws') return 'AWS';
    return s.toUpperCase();
  })));

  // Extract degree
  let detectedDegree = 'MCA / B.Tech Computer Science';
  for (const d of DEGREE_PATTERNS) {
    if (d.regex.test(cleanText)) {
      detectedDegree = d.degree;
      break;
    }
  }

  // Calculate Match Score with Job Payload
  return {
    rawLength: text.length,
    detectedDegree,
    skills: uniqueSkills,
    parsedAt: new Date()
  };
}

/**
 * Calculates a match score (0-100%) between a candidate profile and a job posting
 * @param {Object} candidateProfile 
 * @param {Object} job 
 */
function calculateJobMatchScore(candidateProfile = {}, job = {}) {
  const candidateSkills = candidateProfile.skills || ['JavaScript', 'React', 'Node.js', 'SQL', 'Python'];
  const jobText = `${job.title} ${job.company} ${job.location} ${job.source}`.toLowerCase();

  let matchedSkillsCount = 0;
  candidateSkills.forEach(skill => {
    if (jobText.includes(skill.toLowerCase())) {
      matchedSkillsCount++;
    }
  });

  // Base score calculation for freshers
  let score = 65; // Base fresher score
  if (candidateSkills.length > 0) {
    const skillRatio = matchedSkillsCount / Math.min(candidateSkills.length, 5);
    score += Math.round(skillRatio * 30);
  }

  // Location bonus for Kerala/India target
  if (job.country === 'India') {
    score += 5;
  }
  if (job.state === 'Kerala') {
    score += 5;
  }

  // Cap at 99%
  return Math.min(99, Math.max(50, score));
}

module.exports = {
  parseResumeText,
  calculateJobMatchScore
};
