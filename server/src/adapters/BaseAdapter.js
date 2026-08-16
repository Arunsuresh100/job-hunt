const { classifyCompany } = require('../utils/companyClassifier');
const { classifyLocation } = require('../utils/locationClassifier');
const { classifyRole } = require('../utils/roleClassifier');
const { resolveCompanyLogo } = require('../utils/logoResolver');

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
    experienceLevel = null,
    companyType = null,
    country = null,
    state = null,
    district = null,
    postedDate = new Date(),
    applyUrl,
    source = this.name,
    tags = []
  }) {
    const cleanCompany = company ? company.trim() : "Tech Enterprise";
    const cleanTitle = title ? title.trim() : "Software Engineer";
    const cleanLocation = location || "Remote / Hybrid";

    const determinedType = companyType || classifyCompany(cleanCompany);
    const locMeta = classifyLocation(cleanLocation, cleanTitle);
    const roleMeta = classifyRole(cleanTitle, tags);
    const resolvedLogo = resolveCompanyLogo(cleanCompany, applyUrl, logoUrl);

    // If caller provided experienceLevel explicitly as Senior/Fresher, respect it, otherwise fallback to roleMeta
    const finalExperience = experienceLevel && experienceLevel !== "Fresher (0-2 Yrs)" && experienceLevel !== "Entry Level / Fresher" 
      ? experienceLevel 
      : roleMeta.experienceLevel;

    return {
      externalId: externalId ? String(externalId) : `${this.name.toLowerCase()}-${cleanTitle.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      company: cleanCompany,
      logoUrl: resolvedLogo,
      title: cleanTitle,
      location: cleanLocation,
      experienceLevel: finalExperience,
      companyType: determinedType,
      country: country || locMeta.country,
      state: state || locMeta.state,
      district: district || locMeta.district,
      postedDate: postedDate instanceof Date && !isNaN(postedDate) ? postedDate : new Date(),
      applyUrl: applyUrl || "https://google.com",
      source: source || this.name,
      isTechRole: roleMeta.isTechRole,
      isFresherEligible: roleMeta.isFresherEligible
    };
  }
}

module.exports = BaseAdapter;

