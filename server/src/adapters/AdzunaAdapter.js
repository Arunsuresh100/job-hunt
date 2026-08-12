const axios = require('axios');
const BaseAdapter = require('./BaseAdapter');

/**
 * Adzuna API Adapter
 * Requires ADZUNA_APP_ID and ADZUNA_APP_KEY in environment variables.
 * Documentation: https://developer.adzuna.com/
 */
class AdzunaAdapter extends BaseAdapter {
  constructor() {
    super('Adzuna API');
    this.appId = process.env.ADZUNA_APP_ID;
    this.appKey = process.env.ADZUNA_APP_KEY;
  }

  async fetchJobs(options = {}) {
    if (!this.appId || !this.appKey) {
      console.log('[AdzunaAdapter] TODO: Add ADZUNA_APP_ID and ADZUNA_APP_KEY in server/.env to enable live Adzuna jobs.');
      return [];
    }

    try {
      const country = options.country || 'in';
      const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/1`;
      const response = await axios.get(url, {
        params: {
          app_id: this.appId,
          app_key: this.appKey,
          results_per_page: options.limit || 20,
          what: options.keywords || 'Software Engineer Fresher MCA',
          max_days_old: 7
        },
        timeout: 10000
      });

      if (!response.data || !Array.isArray(response.data.results)) {
        return [];
      }

      return response.data.results.map(item => this.normalizeJob({
        externalId: `adzuna-${item.id}`,
        company: item.company?.display_name || 'Tech Company',
        title: item.title,
        location: item.location?.display_name || 'India',
        experienceLevel: 'Fresher / Entry Level',
        postedDate: new Date(item.created),
        applyUrl: item.redirect_url,
        source: 'Adzuna API'
      }));
    } catch (error) {
      console.warn(`[AdzunaAdapter] API request failed: ${error.message}`);
      return [];
    }
  }
}

module.exports = AdzunaAdapter;
