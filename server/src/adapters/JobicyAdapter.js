const axios = require('axios');
const BaseAdapter = require('./BaseAdapter');

/**
 * Jobicy Remote Jobs API Adapter (Free Public API, No Key Required)
 * URL: https://jobicy.com/api/v2/remote-jobs
 */
class JobicyAdapter extends BaseAdapter {
  constructor() {
    super('Jobicy API');
    this.apiUrl = 'https://jobicy.com/api/v2/remote-jobs?count=20&industry=engineering';
  }

  async fetchJobs(options = {}) {
    try {
      const response = await axios.get(this.apiUrl, { timeout: 10000 });
      const jobList = response.data && Array.isArray(response.data.data) ? response.data.data : [];

      if (!jobList.length) {
        return [];
      }

      return jobList.slice(0, 20).map(item => {
        return this.normalizeJob({
          externalId: `jobicy-${item.id || item.url}`,
          company: item.companyName,
          logoUrl: item.companyLogo || null,
          title: item.jobTitle,
          location: item.jobGeo || 'Remote / Worldwide',
          experienceLevel: 'Fresher (0-2 Yrs)',
          postedDate: item.pubDate ? new Date(item.pubDate) : new Date(),
          applyUrl: item.url,
          source: 'Jobicy API'
        });
      });
    } catch (error) {
      console.warn(`[JobicyAdapter] Failed to fetch live jobs: ${error.message}`);
      return [];
    }
  }
}

module.exports = JobicyAdapter;
