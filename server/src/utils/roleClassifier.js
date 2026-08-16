/**
 * Role & Seniority Classifier for MCA & Engineering Freshers
 */

const SENIORITY_REGEX = /\b(senior|sr\.?|lead|director|head|vp|vice president|principal|staff|architect|manager|executive|account executive|5\+|7\+|10\+|years of experience|yrs exp|d\/f\/m)\b/i;

const TECH_CS_KEYWORDS_REGEX = /\b(software|developer|engineer|frontend|front-end|backend|back-end|fullstack|full-stack|full stack|web|data|ai|ml|qa|tester|testing|cloud|devops|trainee|intern|graduate|associate|programmer|coder|java|python|react|node|javascript|typescript|c\+\+|c#|sql|system|it|network|embedded|mobile|android|ios|flutter|support analyst)\b/i;

const NON_TECH_BLACKLIST_REGEX = /\b(sales|account executive|marketing|accountant|real estate|nursing|nurse|medical|recruiter|hr manager|human resources|payroll|chef|driver|call center|insurance|financial advisor|retail|store manager|sales representative|customer representative)\b/i;

/**
 * Classifies job title & tags into experience level and MCA/CS relevance
 * @param {string} title 
 * @param {Array<string>} tags 
 * @returns {{ experienceLevel: string, isTechRole: boolean, isFresherEligible: boolean }}
 */
function classifyRole(title = '', tags = []) {
  const cleanTitle = title.trim();
  const tagsStr = Array.isArray(tags) ? tags.join(' ') : '';
  const text = `${cleanTitle} ${tagsStr}`.toLowerCase();

  const isSenior = SENIORITY_REGEX.test(text) && !text.includes('graduate trainee') && !text.includes('trainee');
  const isBlacklisted = NON_TECH_BLACKLIST_REGEX.test(text);
  const matchesTechKeywords = TECH_CS_KEYWORDS_REGEX.test(text);

  const isTechRole = matchesTechKeywords && !isBlacklisted;
  const isFresherEligible = !isSenior && isTechRole;

  let experienceLevel = 'Fresher (0-2 Yrs)';
  if (isSenior) {
    experienceLevel = 'Senior / Experienced';
  } else if (text.includes('intern') || text.includes('trainee')) {
    experienceLevel = 'Entry Level / Trainee';
  }

  return {
    experienceLevel,
    isTechRole,
    isFresherEligible
  };
}

module.exports = {
  classifyRole
};
