const config = require('../config');

// In-memory storage for student indices
const studentSubmissions = new Map();

class LlamaService {
  constructor() {
    console.log('Initializing simplified student data service');
  }

  // Get student submissions
  async getStudentSubmissions(studentId) {
    if (!studentSubmissions.has(studentId)) {
      studentSubmissions.set(studentId, []);
    }
    return studentSubmissions.get(studentId);
  }

  // Add a submission for a student
  async addSubmissionToIndex(studentId, submission) {
    try {
      const submissions = await this.getStudentSubmissions(studentId);
      
      const submissionData = {
        text: submission.text,
        grade: submission.grade || 0,
        feedback: submission.feedback || 'No feedback',
        assignmentTitle: submission.assignmentTitle || 'Untitled Assignment',
        timestamp: new Date().toISOString()
      };
      
      submissions.push(submissionData);
      console.log(`Added submission for student ${studentId}`);
      
      return true;
    } catch (error) {
      console.error("Error adding submission:", error);
      return false;
    }
  }

  // Get personalized feedback based on historical patterns
  async getPersonalizedFeedback(studentId, currentSubmission) {
    try {
      const submissions = await this.getStudentSubmissions(studentId);
      
      if (submissions.length === 0) {
        return {
          historicalPatterns: "No historical performance data available."
        };
      }
      
      // Calculate average grade
      const averageGrade = submissions.reduce((sum, sub) => sum + sub.grade, 0) / submissions.length;
      
      // Get common feedback themes (simplified)
      const feedbackThemes = submissions
        .map(sub => sub.feedback)
        .join(' ')
        .toLowerCase();
      
      // Identify strength indicators
      const strengthIndicators = [
        'excellent', 'good', 'well done', 'strength', 'impressive'
      ].filter(word => feedbackThemes.includes(word));
      
      // Identify improvement areas
      const improvementIndicators = [
        'improve', 'needs work', 'consider', 'should', 'try to'
      ].filter(word => feedbackThemes.includes(word));
      
      // Compile historical patterns summary
      const historicalPatterns = `
        Historical Performance Summary:
        - Number of previous submissions: ${submissions.length}
        - Average grade: ${averageGrade.toFixed(1)}
        - Strengths: ${strengthIndicators.length > 0 ? strengthIndicators.join(', ') : 'No clear strengths identified yet'}
        - Areas for improvement: ${improvementIndicators.length > 0 ? improvementIndicators.join(', ') : 'No clear improvement areas identified yet'}
      `;
      
      return { historicalPatterns };
    } catch (error) {
      console.error("Error getting personalized feedback:", error);
      return {
        historicalPatterns: "Error retrieving historical performance data."
      };
    }
  }
}

module.exports = new LlamaService(); 