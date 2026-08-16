/**
 * Automated Deep-Link Guard Utility
 * Ensures every application URL contains specific job requisition parameters
 * or direct deep-link paths instead of bare root domain corporate homepages.
 */
function resolveDeepLink(url, company = '', title = '') {
  if (!url) return 'https://google.com';

  const cleanTitle = title ? title.trim() : '';
  const cleanCompany = company ? company.trim() : '';

  try {
    const parsed = new URL(url);

    // If URL already contains specific job requisition markers, return as-is
    if (
      parsed.pathname.includes('/job') ||
      parsed.pathname.includes('/jobs/') ||
      parsed.pathname.includes('/careers/') ||
      parsed.pathname.includes('/search') ||
      parsed.pathname.includes('/employment') ||
      parsed.searchParams.has('job_id') ||
      parsed.searchParams.has('q') ||
      parsed.searchParams.has('keyword')
    ) {
      return url;
    }

    // Bare root domain corporate homepage detected -> Append target search parameters
    const encodedTitle = encodeURIComponent(cleanTitle);
    return `${url.replace(/\/$/, '')}/careers?keyword=${encodedTitle}`;
  } catch (e) {
    return url;
  }
}

module.exports = { resolveDeepLink };
