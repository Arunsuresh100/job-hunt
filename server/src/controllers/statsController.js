const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const fifteenDaysFromNow = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000);

    const [
      freshJobsCount,
      totalJobsCount,
      upcomingExamsCount,
      urgentExamsCount,
      savedCount,
      lastSource
    ] = await Promise.all([
      prisma.job.count({ where: { isArchived: false } }),
      prisma.job.count(),
      prisma.exam.count({ where: { applicationEndDate: { gte: now } } }),
      prisma.exam.count({
        where: {
          applicationEndDate: {
            gte: now,
            lte: fifteenDaysFromNow
          }
        }
      }),
      prisma.savedItem.count(),
      prisma.jobSource.findFirst({
        orderBy: { lastSyncAt: 'desc' }
      })
    ]);

    return res.json({
      success: true,
      stats: {
        freshJobsCount,
        totalJobsCount,
        upcomingExamsCount,
        urgentExamsCount,
        savedCount,
        lastSyncAt: lastSource?.lastSyncAt || new Date()
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getDashboardStats
};
