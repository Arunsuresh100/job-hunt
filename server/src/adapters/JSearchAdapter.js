const axios = require('axios');
const BaseAdapter = require('./BaseAdapter');

/**
 * JSearch API (RapidAPI) Adapter
 * Requires RAPIDAPI_KEY in server/.env
 * Documentation: https://rapidapi.com/letscrape-6582-7354/api/jsearch
 */
class JSearchAdapter extends BaseAdapter {
  constructor() {
    super('JSearch API');
    this.rapidApiKey = process.env.RAPIDAPI_KEY;
  }

  async fetchJobs(options = {}) {
    if (!this.rapidApiKey) {
      console.log('[JSearchAdapter] TODO: Add RAPIDAPI_KEY in server/.env to enable live RapidAPI JSearch listings.');
      return [];
    }

    try {
      const response = await axios.get('https://jsearch.p.rapidapi.com/search', {
        headers: {
          'X-RapidAPI-Key': this.rapidApiKey,
          'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
        },
        params: {
          query: options.keywords || 'Fresher Software Developer India',
          page: '1',
          num_pages: '1',
          date_posted: 'week'
        },
        timeout: 10000
      });

      if (!response.data || !Array.isArray(response.data.data)) {
        return [];
      }

      return response.data.data.map(item => this.normalizeJob({
        externalId: item.job_id,
        company: item.employer_name || 'Global Enterprise',
        logoUrl: item.employer_logo,
        title: item.job_title,
        location: `${item.job_city || ''} ${item.job_country || 'India'}`.trim(),
        experienceLevel: 'Fresher (0-2 Yrs)',
        postedDate: new Date(item.job_posted_at_datetime_utc || Date.now()),
        applyUrl: item.job_apply_link,
        source: 'JSearch RapidAPI'
      }));
    } catch (error) {
      console.warn(`[JSearchAdapter] API request failed: ${error.message}`);
      return [];
    }
  }
}

module.exports = JSearchAdapter;
