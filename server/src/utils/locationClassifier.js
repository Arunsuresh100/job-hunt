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

const FOREIGN_KEYWORDS = [
  'germany', 'düsseldorf', 'dusseldorf', 'munich', 'münchen', 'berlin', 'hamburg', 'frankfurt', 
  'stuttgart', 'cologne', 'köln', 'leipzig', 'dresden', 'essen', 'nuremberg', 'nürnberg', 'bonn',
  'united states', 'usa', 'us remote', 'new york', 'california', 'san francisco', 'austin', 'seattle',
  'united kingdom', 'uk', 'london', 'manchester', 'birmingham',
  'canada', 'toronto', 'vancouver', 'montreal',
  'australia', 'sydney', 'melbourne',
  'europe', 'eu remote', 'netherlands', 'amsterdam', 'france', 'paris', 'spain', 'madrid', 
  'barcelona', 'switzerland', 'zurich', 'poland', 'warsaw', 'sweden', 'stockholm', 'singapore', 
  'japan', 'tokyo', 'dubai', 'uae', 'worldwide', 'global remote'
];

const EXPLICIT_INDIA_KEYWORDS = [
  'india', 'pan india', 'pan-india', 'kerala', 'karnataka', 'tamil nadu', 'telangana', 'maharashtra', 
  'delhi', 'ncr', 'bengaluru', 'bangalore', 'hyderabad', 'mumbai', 'pune', 'chennai', 'kochi', 
  'cochin', 'trivandrum', 'thiruvananthapuram', 'technopark', 'infopark', 'cyberpark', 'calicut', 
  'kozhikode', 'noida', 'gurgaon', 'gurugram', 'kolkata', 'ahmedabad', 'jaipur', 'indore', 'coimbatore', 'mysore'
];

/**
 * Classifies location string into { country, state, district }
 * @param {string} locationStr 
 * @param {string} titleStr 
 */
function classifyLocation(locationStr = '', titleStr = '') {
  const text = `${locationStr} ${titleStr}`.toLowerCase();

  const isExplicitIndia = EXPLICIT_INDIA_KEYWORDS.some(kw => text.includes(kw));
  const isForeign = FOREIGN_KEYWORDS.some(kw => text.includes(kw));

  let country = 'India';
  if (isExplicitIndia) {
    country = 'India';
  } else if (isForeign) {
    country = 'Worldwide';
  } else {
    // Safety Fallback: Default unrecognized API locations to Worldwide instead of forcing India
    country = 'Worldwide';
  }

  // Detect Indian State
  let state = null;
  if (country === 'India') {
    for (const s of INDIAN_STATES_MAP) {
      if (s.keywords.some(kw => text.includes(kw))) {
        state = s.name;
        break;
      }
    }
    if (!state) {
      state = 'India (Remote / Pan-India)';
    }
  }

  // Detect Kerala District
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

