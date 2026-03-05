import { Request, Response } from 'express';
import { generateCareerCounselingReport, StudentFormInput } from '../services/careerCounseling.service';

/**
 * @route   POST /api/career-counseling/generate
 * @desc    Generate AI career counseling report based on student profile
 * @access  Public
 */
export const generateReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      fullName,
      dateOfBirth,
      currentClass,
      board,
      stream,
      subjects,
      exams,
      preferredLocation,
      preferredColleges,
      preferredLanguage,
      interests,
    } = req.body as StudentFormInput;

    // Validate required fields
    if (!fullName || !currentClass || !board || !stream) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: fullName, currentClass, board, and stream are required.',
      });
      return;
    }

    if (!exams || !Array.isArray(exams) || exams.length === 0) {
      res.status(400).json({
        success: false,
        message: 'At least one entrance exam must be selected.',
      });
      return;
    }

    if (!interests || !Array.isArray(interests) || interests.length === 0) {
      res.status(400).json({
        success: false,
        message: 'At least one interest must be selected.',
      });
      return;
    }

    const input: StudentFormInput = {
      fullName: fullName.trim(),
      dateOfBirth,
      currentClass,
      board,
      stream,
      subjects: subjects?.trim(),
      exams,
      preferredLocation: preferredLocation?.trim(),
      preferredColleges: preferredColleges?.trim(),
      preferredLanguage,
      interests,
    };

    const report = await generateCareerCounselingReport(input);

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error: any) {
    console.error('[Career Counseling Controller] Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to generate career counseling report. Please try again.',
    });
  }
};
