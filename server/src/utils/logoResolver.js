/**
 * Official Company Domain & Logo Resolver
 * Resolves official 128px logos using Google's global high-speed favicon service and domain mapping.
 */

const COMPANY_DOMAIN_MAP = {
  'tcs': 'tcs.com',
  'tata consultancy services': 'tcs.com',
  'quest global': 'quest-global.com',
  'quest global services': 'quest-global.com',
  'ust': 'ust.com',
  'ust global': 'ust.com',
  'experion': 'experionglobal.com',
  'experion technologies': 'experionglobal.com',
  'tata elxsi': 'tataelxsi.com',
  'ibs software': 'ibsplc.com',
  'sutherland': 'sutherlandglobal.com',
  'sutherland global': 'sutherlandglobal.com',
  'flytxt': 'flytxt.com',
  'flytxt mobile solutions': 'flytxt.com',
  'carestack': 'carestack.com',
  'surveysparrow': 'surveysparrow.com',
  'neoito': 'neoito.com',
  'keyvalue': 'keyvalue.systems',
  'keyvalue software systems': 'keyvalue.systems',
  'accubits': 'accubits.com',
  'accubits technologies': 'accubits.com',
  'algomox': 'algomox.com',
  'bigbinary': 'bigbinary.com',
  'inapp': 'inapp.com',
  'inapp information technologies': 'inapp.com',
  'google': 'google.com',
  'ibm': 'ibm.com',
  'ibm india': 'ibm.com',
  'infosys': 'infosys.com',
  'zoho': 'zoho.com',
  'zoho corporation': 'zoho.com',
  'wipro': 'wipro.com',
  'accenture': 'accenture.com',
  'cognizant': 'cognizant.com',
  'capgemini': 'capgemini.com',
  'oracle': 'oracle.com',
  'microsoft': 'microsoft.com',
  'amazon': 'amazon.com',
  'apple': 'apple.com',
  'meta': 'meta.com',
  'adobe': 'adobe.com',
  'cisco': 'cisco.com',
  'intel': 'intel.com',
  'salesforce': 'salesforce.com',
  'nvidia': 'nvidia.com'
};

/**
 * Resolves the official logo URL for a company
 * @param {string} companyName 
 * @param {string} applyUrl 
 * @param {string} existingLogoUrl 
 * @returns {string} Official Logo URL
 */
function resolveCompanyLogo(companyName = '', applyUrl = '', existingLogoUrl = null) {
  const nameLower = companyName ? companyName.toLowerCase().trim() : '';

  // 1. Direct domain mapping lookup
  for (const [key, domain] of Object.entries(COMPANY_DOMAIN_MAP)) {
    if (nameLower === key || nameLower.includes(key)) {
      return `https://www.google.com/s2/favicons?domain=https://${domain}&sz=128`;
    }
  }

  // 2. Extract domain from applyUrl if valid http/https link
  if (applyUrl && typeof applyUrl === 'string' && applyUrl.startsWith('http')) {
    try {
      const parsed = new URL(applyUrl);
      let hostname = parsed.hostname.replace(/^www\./, '');
      // Avoid returning generic job board domains (remotive.com, arbeitnow.com, jobicy.com) as company logo
      const jobBoards = ['remotive.com', 'arbeitnow.com', 'jobicy.com', 'adzuna.com', 'rapidapi.com', 'github.com', 'linkedin.com'];
      if (!jobBoards.some(board => hostname.includes(board))) {
        return `https://www.google.com/s2/favicons?domain=https://${hostname}&sz=128`;
      }
    } catch (e) {
      // Ignore URL parse errors
    }
  }

  // 3. If an existing valid logoUrl is passed and is not a generic placeholder
  if (existingLogoUrl && typeof existingLogoUrl === 'string' && existingLogoUrl.startsWith('http')) {
    if (!existingLogoUrl.includes('unsplash.com') && !existingLogoUrl.includes('ui-avatars.com')) {
      return existingLogoUrl;
    }
  }

  // 4. Fallback domain inference from company name
  const inferredDomain = nameLower.replace(/[^a-z0-9]/g, '') + '.com';
  return `https://www.google.com/s2/favicons?domain=https://${inferredDomain}&sz=128`;
}

module.exports = {
  resolveCompanyLogo,
  COMPANY_DOMAIN_MAP
};
