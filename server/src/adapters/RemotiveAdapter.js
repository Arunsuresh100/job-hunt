const axios = require('axios');
const BaseAdapter = require('./BaseAdapter');

/**
 * Remotive API Adapter (Free Public API, No Key Required)
 * URL: https://remotive.com/api/remote-jobs
 */
class RemotiveAdapter extends BaseAdapter {
  constructor() {
    super('Remotive API');
    this.apiUrl = 'https://remotive.com/api/remote-jobs?category=software-dev&limit=25';
  }

  async fetchJobs(options = {}) {
    try {
      const response = await axios.get(this.apiUrl, { timeout: 10000 });
      if (!response.data || !Array.isArray(response.data.jobs)) {
        return [];
      }

      const techKeywords = ['software', 'developer', 'engineer', 'frontend', 'backend', 'full stack', 'web', 'data', 'ai', 'ml', 'python', 'java', 'react', 'node', 'system', 'qa', 'tech', 'cloud', 'security'];

      const techJobs = response.data.jobs.filter(item => {
        const titleLower = (item.title || '').toLowerCase();
        const categoryLower = (item.category || '').toLowerCase();
        return techKeywords.some(kw => titleLower.includes(kw) || categoryLower.includes(kw));
      });

      const jobs = techJobs.slice(0, 20).map(item => {
        return this.normalizeJob({
          externalId: `remotive-${item.id}`,
          company: item.company_name,
          logoUrl: null, // Avoid 403 NotSameOrigin hotlink error from remotive CDN
          title: item.title,
          location: item.candidate_required_location || 'Remote / Worldwide',
          experienceLevel: item.job_type === 'full_time' ? 'Fresher (0-2 Yrs)' : 'Entry Level / Trainee',
          postedDate: item.publication_date ? new Date(item.publication_date) : new Date(),
          applyUrl: item.url,
          source: 'Remotive API'
        });
      });

      return jobs;
    } catch (error) {
      console.warn(`[RemotiveAdapter] Failed to fetch live jobs: ${error.message}`);
      return [];
    }
  }
}

module.exports = RemotiveAdapter;
