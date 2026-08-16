const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Get Exam Updates (defaults to Kerala exams) sorted by nearest deadline first
 */
const getExams = async (req, res) => {
  try {
    const { category, search, keralaOnly } = req.query;
    const where = {};

    // Filter Kerala exams by default unless explicitly disabled
    if (keralaOnly !== 'false') {
      where.isKerala = true;
    }

    if (category && category.trim() !== '') {
      const catClean = category.trim();
      where.category = { contains: catClean };
    }

    if (search && search.trim() !== '') {
      const query = search.trim();
      where.OR = [
        { name: { contains: query } },
        { conductingBody: { contains: query } },
        { category: { contains: query } },
        { description: { contains: query } }
      ];
    }

    const exams = await prisma.exam.findMany({
      where,
      orderBy: { applicationEndDate: 'asc' },
      include: {
        savedItems: true
      }
    });

    const now = new Date();
    const formattedExams = exams.map(exam => {
      const appEnd = new Date(exam.applicationEndDate);
      const diffMs = appEnd.getTime() - now.getTime();
      const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      
      return {
        ...exam,
        isSaved: exam.savedItems.length > 0,
        daysRemaining,
        isUrgent: daysRemaining >= 0 && daysRemaining <= 15,
        isExpired: daysRemaining < 0
      };
    });

    return res.json({
      success: true,
      exams: formattedExams
    });
  } catch (error) {
    console.error('Error fetching exams:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Admin: Create new exam entry
 */
const createExam = async (req, res) => {
  try {
    const {
      name,
      conductingBody,
      category,
      location,
      state,
      isKerala,
      notificationDate,
      applicationStartDate,
      applicationEndDate,
      examDate,
      officialUrl,
      description
    } = req.body;

    if (!name || !conductingBody || !applicationEndDate || !officialUrl) {
      return res.status(400).json({
        success: false,
        error: 'Required fields missing: name, conductingBody, applicationEndDate, officialUrl'
      });
    }

    const exam = await prisma.exam.create({
      data: {
        name,
        conductingBody,
        category: category || 'Teaching & Lectureship',
        location: location || 'Kerala',
        state: state || 'Kerala',
        isKerala: isKerala !== undefined ? Boolean(isKerala) : true,
        notificationDate: notificationDate ? new Date(notificationDate) : new Date(),
        applicationStartDate: applicationStartDate ? new Date(applicationStartDate) : new Date(),
        applicationEndDate: new Date(applicationEndDate),
        examDate: examDate ? new Date(examDate) : null,
        officialUrl,
        description
      }
    });

    return res.status(201).json({ success: true, exam });
  } catch (error) {
    console.error('Error creating exam:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Admin: Update existing exam entry
 */
const updateExam = async (req, res) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };

    if (data.notificationDate) data.notificationDate = new Date(data.notificationDate);
    if (data.applicationStartDate) data.applicationStartDate = new Date(data.applicationStartDate);
    if (data.applicationEndDate) data.applicationEndDate = new Date(data.applicationEndDate);
    if (data.examDate) data.examDate = new Date(data.examDate);

    const exam = await prisma.exam.update({
      where: { id },
      data
    });

    return res.json({ success: true, exam });
  } catch (error) {
    console.error('Error updating exam:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Admin: Delete exam entry
 */
const deleteExam = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.exam.delete({ where: { id } });
    return res.json({ success: true, message: 'Exam deleted successfully' });
  } catch (error) {
    console.error('Error deleting exam:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getExams,
  createExam,
  updateExam,
  deleteExam
};
