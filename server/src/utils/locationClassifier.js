/**
 * Location Classifier for Indian States & Kerala Districts
 */

const KERALA_DISTRICT_MAP = [
  {
    name: 'Ernakulam (Kochi)',
    keywords: ['kochi', 'cochin', 'ernakulam', 'infopark', 'kalamassery', 'kakkanad', 'aluva']
  },
  {
    name: 'Thiruvananthapuram',
    keywords: ['trivandrum', 'thiruvananthapuram', 'technopark', 'kazhakkoottam', 'kazhakuttam']
  },
  {
    name: 'Kozhikode',
    keywords: ['kozhikode', 'calicut', 'cyberpark']
  },
  {
    name: 'Thrissur',
    keywords: ['thrissur', 'trichur', 'koratty']
  },
  {
    name: 'Kottayam',
    keywords: ['kottayam']
  },
  {
    name: 'Malappuram',
    keywords: ['malappuram', 'perinthalmanna', 'manjeri']
  },
  {
    name: 'Palakkad',
    keywords: ['palakkad', 'palghat']
  },
  {
    name: 'Kannur',
    keywords: ['kannur', 'cannanore']
  },
  {
    name: 'Kollam',
    keywords: ['kollam', 'quilon']
  },
  {
    name: 'Alappuzha',
    keywords: ['alappuzha', 'alleppey']
  },
  {
    name: 'Wayanad',
    keywords: ['wayanad', 'kalpetta']
  },
  {
    name: 'Kasaragod',
    keywords: ['kasaragod', 'kasargod']
  }
];

const INDIAN_STATES_MAP = [
  {
    name: 'Kerala',
    keywords: ['kerala', 'kochi', 'cochin', 'ernakulam', 'trivandrum', 'thiruvananthapuram', 'technopark', 'infopark', 'calicut', 'kozhikode', 'cyberpark', 'thrissur', 'kottayam', 'palakkad', 'kannur', 'malappuram']
  },
  {
    name: 'Karnataka',
    keywords: ['karnataka', 'bengaluru', 'bangalore', 'mysore', 'mangalore', 'hubli', 'belgaum']
  },
  {
    name: 'Tamil Nadu',
    keywords: ['tamil nadu', 'chennai', 'coimbatore', 'madurai', 'trichy', 'tiruchirappalli', 'salem']
  },
  {
    name: 'Telangana',
    keywords: ['telangana', 'hyderabad', 'warangal', 'secunderabad']
  },
  {
    name: 'Maharashtra',
    keywords: ['maharashtra', 'mumbai', 'pune', 'nagpur', 'nashik', 'navi mumbai', 'thane']
  },
  {
    name: 'Delhi NCR',
    keywords: ['delhi', 'noida', 'gurgaon', 'gurugram', 'ghaziabad', 'faridabad', 'ncr']
  },
  {
    name: 'West Bengal',
    keywords: ['west bengal', 'kolkata', 'salt lake', 'new town']
  }
];

/**
 * Classifies location string into { country, state, district }
 * @param {string} locationStr 
 * @param {string} titleStr 
 */
function classifyLocation(locationStr = '', titleStr = '') {
  const text = `${locationStr} ${titleStr}`.toLowerCase();

  // 1. Detect Country
  let country = 'India';
  const isWorldwide = text.includes('worldwide') || text.includes('berlin') || text.includes('germany') || text.includes('us remote') || text.includes('europe');
  const isExplicitIndia = text.includes('india') || text.includes('pan india') || text.includes('kerala') || text.includes('bengaluru') || text.includes('hyderabad') || text.includes('mumbai') || text.includes('delhi') || text.includes('chennai') || text.includes('kochi') || text.includes('trivandrum');

  if (isWorldwide && !isExplicitIndia) {
    country = 'Worldwide';
  } else {
    country = 'India';
  }

  // 2. Detect Indian State
  let state = null;
  for (const s of INDIAN_STATES_MAP) {
    if (s.keywords.some(kw => text.includes(kw))) {
      state = s.name;
      break;
    }
  }

  if (!state && country === 'India') {
    state = 'India (Remote / Pan-India)';
  }

  // 3. Detect Kerala District
  let district = null;
  if (state === 'Kerala') {
    for (const d of KERALA_DISTRICT_MAP) {
      if (d.keywords.some(kw => text.includes(kw))) {
        district = d.name;
        break;
      }
    }
    if (!district) {
      district = 'Ernakulam (Kochi)'; // Default primary IT hub
    }
  }

  return {
    country,
    state,
    district
  };
}

module.exports = {
  classifyLocation,
  KERALA_DISTRICT_MAP,
  INDIAN_STATES_MAP
};
