const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { catchAsync } = require('../utils/error-handler');
const Assignment = require('../models/assignment.model');

// Get teacher analytics
router.get(
  '/teacher/:id',
  authenticate,
  authorize('teacher'),
  catchAsync(async (req, res) => {
    const assignments = await Assignment.find({ createdBy: req.params.id });

    // Calculate metrics
    const totalAssignments = assignments.length;
    const totalSubmissions = assignments.reduce(
      (acc, curr) => acc + curr.submissions.length,
      0
    );
    const averageGrade = assignments.reduce((acc, curr) => {
      const grades = curr.submissions
        .filter((s) => s.grade)
        .map((s) => s.grade);
      return grades.length ? acc + grades.reduce((a, b) => a + b) / grades.length : acc;
    }, 0) / (totalAssignments || 1);

    // Get submission trends
    const submissionsByDate = assignments.reduce((acc, curr) => {
      curr.submissions.forEach((sub) => {
        const date = sub.submittedAt.toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
      });
      return acc;
    }, {});

    // Get grade distribution
    const gradeDistribution = assignments.reduce((acc, curr) => {
      curr.submissions.forEach((sub) => {
        if (sub.grade) {
          const gradeRange = Math.floor(sub.grade / 10) * 10;
          acc[gradeRange] = (acc[gradeRange] || 0) + 1;
        }
      });
      return acc;
    }, {});

    res.json({
      status: 'success',
      data: {
        totalAssignments,
        totalSubmissions,
        averageGrade,
        submissionsByDate,
        gradeDistribution,
      },
    });
  })
);

// Get student analytics
router.get(
  '/student/:id',
  authenticate,
  catchAsync(async (req, res) => {
    // Ensure users can only view their own analytics
    if (req.user.role === 'student' && req.user.id !== req.params.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to view these analytics',
      });
    }

    const submissions = await Assignment.find({
      'submissions.student': req.params.id,
    }).populate('submissions.student', 'name email');

    // Calculate metrics
    const totalSubmissions = submissions.length;
    const completedAssignments = submissions.filter(
      (a) => a.submissions.some((s) => s.student._id.toString() === req.params.id)
    ).length;

    // Calculate grade trends
    const gradeTrends = submissions
      .filter((a) => 
        a.submissions.some(
          (s) => s.student._id.toString() === req.params.id && s.grade
        )
      )
      .map((a) => {
        const submission = a.submissions.find(
          (s) => s.student._id.toString() === req.params.id
        );
        return {
          assignmentTitle: a.title,
          grade: submission.grade,
          submittedAt: submission.submittedAt,
        };
      })
      .sort((a, b) => a.submittedAt - b.submittedAt);

    // Calculate average grade
    const averageGrade = gradeTrends.reduce(
      (acc, curr) => acc + curr.grade,
      0
    ) / (gradeTrends.length || 1);

    res.json({
      status: 'success',
      data: {
        totalSubmissions,
        completedAssignments,
        averageGrade,
        gradeTrends,
      },
    });
  })
);

module.exports = router; 