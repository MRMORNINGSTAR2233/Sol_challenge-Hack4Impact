const { Groq } = require('groq-sdk');
const llamaService = require('./llama.service');
const config = require('../config');

class AIService {
  constructor() {
    // Initialize Groq client for direct API calls
    this.groq = new Groq({
      apiKey: config.groqApiKey
    });
    
    console.log('AI Service initialized with Groq API');
  }

  async gradeAssignment(submission, rubric, studentId = null) {
    try {
      const prompt = `
        You are an expert teacher grading an assignment.
        
        Rubric:
        ${rubric}
        
        Current Submission:
        ${submission}
        
        Please provide a comprehensive evaluation including:
        1. Numerical grade (0-100)
        2. Detailed feedback with specific references to the submission
        3. Areas for improvement
        4. Identified strengths and progress
        5. Actionable next steps for learning
        
        Format your response as:
        Grade: [number]
        Feedback: [detailed explanation]
      `;
      
      const completion = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: "llama3-8b-8192",
        temperature: 0.3,
      });
      
      const response = completion.choices[0]?.message?.content || '';
      const { grade, feedback } = this._extractGradeAndFeedback(response);
      
      // Store the submission in the student's index if studentId is provided
      if (studentId) {
        try {
          await llamaService.addSubmissionToIndex(studentId, {
            text: submission,
            grade,
            feedback,
            assignmentTitle: "Assignment", // This should be passed from the controller
          });
        } catch (error) {
          console.error("Error storing submission in index:", error);
          // Continue even if indexing fails
        }
      }
      
      return { grade, feedback };
    } catch (error) {
      console.error('AI grading error:', error);
      throw new Error('Failed to grade assignment');
    }
  }

  async generateFeedback(submission, grade, studentId = null) {
    try {
      // Get student context if studentId is provided
      let studentContext = "No historical data available.";
      if (studentId) {
        try {
          const context = await llamaService.getPersonalizedFeedback(studentId, submission);
          studentContext = context.historicalPatterns;
        } catch (error) {
          console.error("Error getting personalized feedback:", error);
          // Continue with default context
        }
      }
      
      const prompt = `
        As an AI tutor, provide constructive feedback for the following submission:
        
        Submission:
        ${submission}
        
        Grade Received: ${grade}
        
        Student History:
        ${studentContext}
        
        Please provide:
        1. Constructive feedback highlighting specific strengths and areas for improvement
        2. Specific suggestions for improvement
        3. Encouragement and motivation
        4. Clear next steps for continued learning
      `;
      
      const completion = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: "mixtral-8x7b-32768",
        temperature: 0.5,
      });
      
      return { feedback: completion.choices[0]?.message?.content || 'No feedback generated' };
    } catch (error) {
      console.error('AI feedback error:', error);
      throw new Error('Failed to generate feedback');
    }
  }

  async chat(messages, context = {}) {
    try {
      // Format messages for the chat model
      const formattedMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));
      
      // Add system message
      formattedMessages.unshift({
        role: 'system',
        content: `You are a helpful AI assistant for students. Provide clear, concise, and educational responses.`,
      });
      
      // Use direct API call for chat
      const completion = await this.groq.chat.completions.create({
        messages: formattedMessages,
        model: "mixtral-8x7b-32768",
        temperature: 0.7,
      });
      
      return {
        response: completion.choices[0]?.message?.content || 'No response generated'
      };
    } catch (error) {
      console.error('AI chat error:', error);
      throw new Error('Failed to generate chat response');
    }
  }

  _extractGradeAndFeedback(response) {
    try {
      const gradeMatch = response.match(/Grade:\s*(\d+)/i);
      const feedbackMatch = response.match(/Feedback:\s*([\s\S]+)$/i);

      return {
        grade: gradeMatch ? parseInt(gradeMatch[1]) : 0,
        feedback: feedbackMatch ? feedbackMatch[1].trim() : 'No feedback provided'
      };
    } catch (error) {
      console.error('Error extracting grade and feedback:', error);
      return { grade: 0, feedback: 'Error processing feedback' };
    }
  }

  async analyzeImage(imageUrl, prompt) {
    // Note: Implement when Groq adds vision capabilities
    throw new Error('Vision capabilities not yet implemented');
  }
}

module.exports = new AIService(); 