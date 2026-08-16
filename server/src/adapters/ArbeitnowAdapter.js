const axios = require('axios');
const BaseAdapter = require('./BaseAdapter');

/**
 * Arbeitnow Job Board API Adapter (Free Public API, No Key Required)
 * URL: https://www.arbeitnow.com/api/job-board-api
 */
class ArbeitnowAdapter extends BaseAdapter {
  constructor() {
    super('Arbeitnow API');
    this.apiUrl = 'https://www.arbeitnow.com/api/job-board-api';
  }

  async fetchJobs(options = {}) {
    try {
      const response = await axios.get(this.apiUrl, { timeout: 8000 });
      if (!response.data || !Array.isArray(response.data.data)) {
        return [];
      }

      const techRegex = /\b(software|developer|engineer|frontend|backend|fullstack|full-stack|full stack|web|data scientist|ai engineer|ml engineer|python|java|react|node|cloud|devops|qa|programmer|coder)\b/i;

      const techJobs = response.data.data.filter(item => {
        const title = item.title || '';
        const tags = Array.isArray(item.tags) ? item.tags.join(' ') : '';
        return techRegex.test(title) || techRegex.test(tags);
      });

      const jobs = techJobs.slice(0, 15).map(item => {
        return this.normalizeJob({
          externalId: item.slug || `arbeitnow-${item.title}`,
          company: item.company_name || 'Global Tech Partner',
          logoUrl: item.company_logo || null,
          title: item.title,
          location: item.location || 'Düsseldorf, Germany (Worldwide)',
          postedDate: new Date(item.created_at * 1000 || Date.now()),
          applyUrl: item.url,
          source: 'Arbeitnow Free API',
          tags: Array.isArray(item.tags) ? item.tags : []
        });
      });

      return jobs;
    } catch (error) {
      console.warn(`[ArbeitnowAdapter] Failed to fetch live jobs: ${error.message}`);
      return [];
    }
  }
}

module.exports = ArbeitnowAdapter;
