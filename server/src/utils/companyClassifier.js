const STARTUP_COMPANIES = [
  'carestack', 'surveysparrow', 'neoito', 'keyvalue', 'bigbinary', 'inapp',
  'cavli wireless', 'fingent', 'acabes', 'algomox', 'accubits', 'pixdynamics',
  'maker village', 'ksum', 'startup mission', 'freshworks', 'postman', 'razorpay',
  'cred', 'swiggy', 'zomato', 'zepto', 'blinkit', 'groww', 'zerodha', 'unacademy'
];

const SERVICE_COMPANIES = [
  'tcs', 'tata consultancy services', 'infosys', 'wipro', 'accenture',
  'cognizant', 'hcl', 'hcltech', 'hcl technologies', 'tech mahindra',
  'capgemini', 'lti mindtree', 'mindtree', 'l&t infotech', 'hexaware',
  'mphasis', 'persistent systems', 'dxc technology', 'genpact', 'syntel',
  'cybage', 'globallogic', 'epam', 'publicis sapient', 'atos', 'tata elxsi',
  'sonata software', 'zensar', 'cgi', 'ust global', 'thoughtworks',
  'deloitte', 'pwc', 'ey', 'kpmg', 'ntt data', 'tata interactive', 'sutherland'
];

const SERVICE_KEYWORDS_REGEX = /\b(consulting|services|outsourcing|staffing|infotech|solutions)\b/i;
const PRODUCT_KEYWORDS_REGEX = /\b(labs|technologies|software|systems|digital|app|platform|ai|gmbh|inc|corp|corporation)\b/i;

/**
 * Classifies a company name as 'Product', 'Service', or 'Startup'
 * @param {string} companyName 
 * @returns {'Product' | 'Service' | 'Startup'}
 */
function classifyCompany(companyName = '') {
  if (!companyName) return 'Product';

  const nameLower = companyName.toLowerCase().trim();

  // Check direct startup company list
  const isDirectStartupMatch = STARTUP_COMPANIES.some(c => 
    nameLower === c || nameLower.startsWith(c + ' ') || nameLower.includes(c)
  );

  if (isDirectStartupMatch || nameLower.includes('startup') || nameLower.includes('incubator')) {
    return 'Startup';
  }

  // Check direct service company list
  const isDirectServiceMatch = SERVICE_COMPANIES.some(c => 
    nameLower === c || nameLower.startsWith(c + ' ') || nameLower.includes(c)
  );

  if (isDirectServiceMatch) {
    return 'Service';
  }

  // Check service keywords in company name
  if (SERVICE_KEYWORDS_REGEX.test(nameLower) && !PRODUCT_KEYWORDS_REGEX.test(nameLower)) {
    return 'Service';
  }

  return 'Product';
}

module.exports = {
  classifyCompany
};
