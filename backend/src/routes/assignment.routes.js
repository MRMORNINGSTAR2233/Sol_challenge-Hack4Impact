const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignment.controller');
const upload = require('../middleware/upload.middleware');
const { authenticate } = require('../middleware/auth.middleware');
const { catchAsync } = require('../utils/error-handler');

// Protected routes
router.use(authenticate);

// Create assignment (teachers only)
router.post('/',
  upload.single('file'),
  catchAsync(assignmentController.createAssignment)
);

// Get all assignments
router.get('/',
  catchAsync(assignmentController.getAssignments)
);

// Get single assignment
router.get('/:id',
  catchAsync(assignmentController.getAssignment)
);

// Get assignment file
router.get('/:id/file',
  catchAsync(assignmentController.getAssignmentFile)
);

// Submit assignment (students only)
router.post('/:id/submit',
  upload.single('file'),
  catchAsync(assignmentController.submitAssignment)
);

// Get submission file
router.get('/:assignmentId/submissions/:submissionId/file',
  catchAsync(assignmentController.getSubmissionFile)
);

// Delete assignment (teachers only)
router.delete('/:id',
  catchAsync(assignmentController.deleteAssignment)
);

module.exports = router; 