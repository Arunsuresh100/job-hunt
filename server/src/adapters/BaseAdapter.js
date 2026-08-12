const { classifyCompany } = require('../utils/companyClassifier');
const { classifyLocation } = require('../utils/locationClassifier');

/**
 * Abstract Base Class for Job Source Adapters
 * All custom and API-based job sources must extend this class.
 */
class BaseAdapter {
  constructor(name, config = {}) {
    this.name = name;
    this.config = config;
  }

  /**
   * Fetch jobs from external source or mock API
   * @param {Object} options - Search options like keywords, limit, etc.
   * @returns {Promise<Array<Object>>} Normalized job items
   */
  async fetchJobs(options = {}) {
    throw new Error(`fetchJobs() method must be implemented by ${this.name}`);
  }

  /**
   * Helper to normalize raw job data into common application schema
   */
  normalizeJob({
    externalId,
    company,
    logoUrl = null,
    title,
    location = "Remote / India",
    experienceLevel = "Fresher (0-2 Yrs)",
    companyType = null,
    country = null,
    state = null,
    district = null,
    postedDate = new Date(),
    applyUrl,
    source = this.name
  }) {
    const cleanCompany = company ? company.trim() : "Tech Enterprise";
    const cleanTitle = title ? title.trim() : "Software Engineer";
    const cleanLocation = location || "Remote / Hybrid";

    const determinedType = companyType || classifyCompany(cleanCompany);
    const locMeta = classifyLocation(cleanLocation, cleanTitle);

    return {
      externalId: externalId ? String(externalId) : `${this.name.toLowerCase()}-${cleanTitle.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      company: cleanCompany,
      logoUrl: logoUrl && typeof logoUrl === 'string' && logoUrl.startsWith('http')
        ? logoUrl
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanCompany)}&background=6366f1&color=fff`,
      title: cleanTitle,
      location: cleanLocation,
      experienceLevel: experienceLevel || "Fresher (0-2 Yrs)",
      companyType: determinedType,
      country: country || locMeta.country,
      state: state || locMeta.state,
      district: district || locMeta.district,
      postedDate: postedDate instanceof Date && !isNaN(postedDate) ? postedDate : new Date(),
      applyUrl: applyUrl || "https://google.com",
      source: source || this.name
    };
  }
}

module.exports = BaseAdapter;
