const { generateRagRecommendations } = require('../utils/ragEngine');
const { parseResumeText } = require('../utils/resumeParser');

/**
 * Handle RAG recommendations request
 */
const getRecommendations = async (req, res) => {
  try {
    const { resumeText = '', query = '' } = req.body;
    const advisory = await generateRagRecommendations(resumeText, query);
    return res.json({
      success: true,
      advisory
    });
  } catch (error) {
    console.error('[RAGController] Error generating recommendations:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Parse candidate resume endpoint
 */
const parseResume = async (req, res) => {
  try {
    const { resumeText = '' } = req.body;
    const parsed = parseResumeText(resumeText);
    return res.json({
      success: true,
      profile: parsed
    });
  } catch (error) {
    console.error('[RAGController] Error parsing resume:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getRecommendations,
  parseResume
};
