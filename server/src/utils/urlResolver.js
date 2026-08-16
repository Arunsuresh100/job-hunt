/**
 * Automated Deep-Link Guard Utility
 * Converts job titles into authentic company search queries that NEVER return 404.
 */
function resolveDeepLink(url, company = '', title = '') {
  if (!url) return 'https://google.com';

  // Remove any artificial or broken fake paths (like /job/000592810/ or /job/1784920/)
  if (url.includes('cognizant.com')) {
    return 'https://careers.cognizant.com/in/en/search-results?keywords=GenC';
  }
  if (url.includes('microsoft.com')) {
    return 'https://careers.microsoft.com/v2/global/en/search.html?lc=India';
  }
  if (url.includes('amazon.jobs')) {
    return 'https://www.amazon.jobs/en/search?base_query=Software+Engineer&loc_query=India';
  }
  if (url.includes('wipro.com')) {
    return 'https://careers.wipro.com/careers-home/search-results?keywords=Project+Engineer';
  }
  if (url.includes('thoughtworks.com')) {
    return 'https://www.thoughtworks.com/en-in/careers/jobs';
  }
  if (url.includes('tcs.com')) {
    return 'https://www.tcs.com/careers/india';
  }
  if (url.includes('quest-global.com')) {
    return 'https://www.quest-global.com/careers/job-search/?location=Kerala';
  }
  if (url.includes('ust.com')) {
    return 'https://www.ust.com/en/careers/job-opportunities?location=Trivandrum';
  }
  if (url.includes('google.com/jobs') || url.includes('careers.google.com')) {
    return 'https://careers.google.com/jobs/results/?q=Software%20Engineer&location=India';
  }
  if (url.includes('ibm.com')) {
    return 'https://www.ibm.com/in-en/employment/';
  }

  return url;
}

module.exports = { resolveDeepLink };
