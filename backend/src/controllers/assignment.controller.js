const Assignment = require('../models/assignment.model');
const storageService = require('../services/storage.service');
const { AppError } = require('../utils/error-handler');

exports.createAssignment = async (req, res) => {
  try {
    const { title, description, dueDate, rubric } = req.body;
    const file = req.file;

    if (!file) {
      throw new AppError('Assignment file is required', 400);
    }

    const fileData = await storageService.uploadFile(file);
    
    const assignment = new Assignment({
      title,
      description,
      dueDate,
      rubric,
      teacher: req.user.id,
      fileId: fileData.fileId,
      filename: fileData.filename,
      contentType: fileData.contentType
    });

    await assignment.save();
    res.status(201).json(assignment);
  } catch (error) {
    throw new AppError(error.message, 400);
  }
};

exports.getAssignment = async (req, res) => {
  const assignment = await Assignment.findById(req.params.id)
    .populate('teacher', 'name email')
    .populate('submissions.student', 'name email');
  
  if (!assignment) {
    throw new AppError('Assignment not found', 404);
  }

  res.json(assignment);
};

exports.getAssignmentFile = async (req, res) => {
  const assignment = await Assignment.findById(req.params.id);
  
  if (!assignment) {
    throw new AppError('Assignment not found', 404);
  }

  const file = await storageService.getFile(assignment.fileId);
  
  res.set('Content-Type', assignment.contentType);
  res.send(file);
};

exports.submitAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      throw new AppError('Assignment not found', 404);
    }

    const file = req.file;
    if (!file) {
      throw new AppError('Submission file is required', 400);
    }

    const fileData = await storageService.uploadFile(file);

    const submission = {
      student: req.user.id,
      fileId: fileData.fileId,
      filename: fileData.filename,
      contentType: fileData.contentType
    };

    assignment.submissions.push(submission);
    await assignment.save();

    res.status(201).json(submission);
  } catch (error) {
    throw new AppError(error.message, 400);
  }
};

exports.getSubmissionFile = async (req, res) => {
  const assignment = await Assignment.findById(req.params.assignmentId);
  
  if (!assignment) {
    throw new AppError('Assignment not found', 404);
  }

  const submission = assignment.submissions.id(req.params.submissionId);
  if (!submission) {
    throw new AppError('Submission not found', 404);
  }

  const file = await storageService.getFile(submission.fileId);
  
  res.set('Content-Type', submission.contentType);
  res.send(file);
};

exports.deleteAssignment = async (req, res) => {
  const assignment = await Assignment.findById(req.params.id);
  
  if (!assignment) {
    throw new AppError('Assignment not found', 404);
  }

  // Delete main assignment file
  await storageService.deleteFile(assignment.fileId);

  // Delete all submission files
  for (const submission of assignment.submissions) {
    await storageService.deleteFile(submission.fileId);
  }

  await Assignment.findByIdAndDelete(req.params.id);
  res.status(204).send();
}; 