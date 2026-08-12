const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Get all saved jobs and exams
 */
const getSavedItems = async (req, res) => {
  try {
    const saved = await prisma.savedItem.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        job: true,
        exam: true
      }
    });

    const now = new Date();

    const jobs = saved
      .filter(item => item.itemType === 'JOB' && item.job)
      .map(item => ({
        savedId: item.id,
        savedAt: item.createdAt,
        ...item.job,
        daysAgo: Math.max(0, Math.floor((now.getTime() - new Date(item.job.postedDate).getTime()) / (1000 * 60 * 60 * 24)))
      }));

    const exams = saved
      .filter(item => item.itemType === 'EXAM' && item.exam)
      .map(item => {
        const appEnd = new Date(item.exam.applicationEndDate);
        const daysRemaining = Math.ceil((appEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return {
          savedId: item.id,
          savedAt: item.createdAt,
          ...item.exam,
          daysRemaining,
          isUrgent: daysRemaining >= 0 && daysRemaining <= 15
        };
      });

    return res.json({
      success: true,
      count: saved.length,
      savedJobs: jobs,
      savedExams: exams
    });
  } catch (error) {
    console.error('Error fetching saved items:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Toggle Save/Bookmark for a job or exam
 */
const toggleSaveItem = async (req, res) => {
  try {
    const { itemType, itemId } = req.body; // itemType: "JOB" | "EXAM"

    if (!itemType || !itemId) {
      return res.status(400).json({ success: false, error: 'itemType and itemId are required' });
    }

    const whereClause = itemType === 'JOB'
      ? { jobId: itemId }
      : { examId: itemId };

    const existing = await prisma.savedItem.findFirst({
      where: whereClause
    });

    if (existing) {
      await prisma.savedItem.delete({ where: { id: existing.id } });
      return res.json({ success: true, isSaved: false, message: 'Item removed from saved' });
    } else {
      const newItem = await prisma.savedItem.create({
        data: {
          itemType,
          jobId: itemType === 'JOB' ? itemId : null,
          examId: itemType === 'EXAM' ? itemId : null
        }
      });
      return res.json({ success: true, isSaved: true, savedItem: newItem, message: 'Item saved successfully' });
    }
  } catch (error) {
    console.error('Error toggling saved item:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getSavedItems,
  toggleSaveItem
};
