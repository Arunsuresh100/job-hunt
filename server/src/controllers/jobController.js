const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const adapterManager = require('../adapters/AdapterManager');

/**
 * Get Job Postings with Hard 7-day Filter & Options
 */
const getJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      company = '',
      companyType = '',
      location = '',
      country = '',
      indiaOnly = 'false',
      state = '',
      district = '',
      keralaOnly = 'false',
      fresherOnly = 'true',
      expLevel = 'ALL',
      showArchived = 'false',
      sourceType = 'ALL', // 'CAREER' (official company pages), 'PORTAL' (LinkedIn, Naukri, etc.), or 'ALL'
      source = '',
      todayOnly = 'false'
    } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const where = {};

    // Hard filter: only show non-archived (posted within 7 days) by default
    if (showArchived !== 'true') {
      where.isArchived = false;
    }

    // Strict Today-Only Filter (Posted today / <= 24 hours)
    if (todayOnly === 'true') {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      where.postedDate = { gte: todayStart };
    }

    // Specific Source Filter (e.g. LinkedIn, Naukri, FoundIt)
    if (source) {
      where.source = { contains: source };
    }

    // Company Filter
    if (company) {
      where.company = { contains: company };
    }

    // Company Type Filter (Product vs Service vs Startup)
    if (companyType && companyType !== 'ALL') {
      where.companyType = companyType;
    }

    // Country / India-Only Filter (Only enforce for CAREER / default views, NOT for PORTAL)
    if (sourceType !== 'PORTAL' && (indiaOnly === 'true' || country === 'India' || (indiaOnly !== 'false' && !country))) {
      where.country = 'India';
    }

    // Kerala Only Filter
    if (keralaOnly === 'true') {
      where.state = 'Kerala';
    } else if (state && state !== 'ALL') {
      where.state = state;
    }

    // Kerala District Filter
    if (district && district !== 'ALL') {
      where.district = district;
    }

    // Custom Location Search String
    if (location) {
      where.location = { contains: location };
    }

    const andConditions = [];

    // Source Type Filter (CAREER vs PORTAL)
    if (sourceType === 'CAREER') {
      // Exclude aggregator portals from main Jobs page
      andConditions.push({
        NOT: [
          { source: { contains: 'LinkedIn' } },
          { source: { contains: 'Naukri' } },
          { source: { contains: 'FoundIt' } },
          { source: { contains: 'Indeed' } },
          { source: { contains: 'Monster' } },
          { source: { contains: 'Jobicy' } },
          { source: { contains: 'Remotive' } },
          { source: { contains: 'Adzuna' } },
          { source: { contains: 'JSearch' } }
        ]
      });
    } else if (sourceType === 'PORTAL') {
      // Include ONLY aggregator portal jobs on Portals page
      andConditions.push({
        OR: [
          { source: { contains: 'LinkedIn' } },
          { source: { contains: 'Naukri' } },
          { source: { contains: 'FoundIt' } },
          { source: { contains: 'Indeed' } },
          { source: { contains: 'Monster' } },
          { source: { contains: 'Jobicy' } },
          { source: { contains: 'Remotive' } },
          { source: { contains: 'Adzuna' } },
          { source: { contains: 'JSearch' } }
        ]
      });
    }

    // Keyword Search
    if (search) {
      andConditions.push({
        OR: [
          { title: { contains: search } },
          { company: { contains: search } },
          { location: { contains: search } }
        ]
      });
    }

    // Specific Experience Level Filter (FRESHER vs ONE_YEAR)
    if (expLevel === 'FRESHER') {
      andConditions.push({
        OR: [
          { experienceLevel: { contains: 'Entry' } },
          { experienceLevel: { contains: 'Trainee' } },
          { experienceLevel: { contains: '0 Yrs' } },
          { experienceLevel: { contains: 'Fresher' } }
        ]
      });
    } else if (expLevel === 'ONE_YEAR') {
      andConditions.push({
        OR: [
          { experienceLevel: { contains: '0-1' } },
          { experienceLevel: { contains: '0-2' } },
          { experienceLevel: { contains: '1 Yr' } },
          { experienceLevel: { contains: 'Fresher' } }
        ]
      });
    } else if (fresherOnly === 'true') {
      andConditions.push({
        OR: [
          { experienceLevel: { contains: 'Fresher' } },
          { experienceLevel: { contains: '0-1' } },
          { experienceLevel: { contains: '0-2' } },
          { experienceLevel: { contains: 'Entry' } },
          { experienceLevel: { contains: 'Trainee' } }
        ],
        NOT: [
          { experienceLevel: { contains: 'Senior' } },
          { experienceLevel: { contains: 'Experienced' } }
        ]
      });
    }

    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    const [jobs, totalCount, companiesList, statesList, districtsList] = await Promise.all([
      prisma.job.findMany({
        where,
        orderBy: { postedDate: 'desc' },
        skip,
        take: limitNum,
        include: {
          savedItems: true
        }
      }),
      prisma.job.count({ where }),
      prisma.job.findMany({
        select: { company: true },
        distinct: ['company']
      }),
      prisma.job.findMany({
        where: { state: { not: null } },
        select: { state: true },
        distinct: ['state']
      }),
      prisma.job.findMany({
        where: { state: 'Kerala', district: { not: null } },
        select: { district: true },
        distinct: ['district']
      })
    ]);

    // Format response with metadata
    const formattedJobs = jobs.map(job => ({
      ...job,
      sourceName: job.source,
      isSaved: job.savedItems.length > 0, // Flag if saved
      daysAgo: Math.max(0, Math.floor((Date.now() - new Date(job.postedDate).getTime()) / (1000 * 60 * 60 * 24)))
    }));

    return res.json({
      success: true,
      jobs: formattedJobs,
      pagination: {
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalCount / limitNum)
      },
      filters: {
        availableCompanies: companiesList.map(c => c.company).sort(),
        availableStates: statesList.map(s => s.state).filter(Boolean).sort(),
        availableDistricts: districtsList.map(d => d.district).filter(Boolean).sort()
      }
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Trigger job source adapter sync manually
 */
const syncJobs = async (req, res) => {
  try {
    const result = await adapterManager.syncAll();
    return res.json({
      success: true,
      message: 'Job sync completed successfully',
      result
    });
  } catch (error) {
    console.error('Error syncing jobs:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getJobs,
  syncJobs
};
