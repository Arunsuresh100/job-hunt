/**
 * Helper utility to parse resume text on the client
 */

const KNOWN_SKILLS = [
  'React', 'Node.js', 'Python', 'Java', 'SQL', 'JavaScript', 'TypeScript',
  'C++', 'HTML/CSS', 'Express.js', 'MongoDB', 'PostgreSQL', 'Docker',
  'AWS', 'Data Analytics', 'QA & Testing', 'Git', 'Flutter', 'Rest API'
];

export function parseResumeText(text = '') {
  if (!text) return { skills: [] };

  const clean = text.toLowerCase();
  const foundSkills = KNOWN_SKILLS.filter((s) => {
    const term = s.toLowerCase().replace('.', '\\.');
    const regex = new RegExp(`\\b${term}\\b`, 'i');
    return regex.test(clean);
  });

  return {
    skills: foundSkills
  };
}
