// server/services/geminiService.js
const { model } = require('../config/gemini');

class GeminiService {
  async generateStudyPlan(params) {
    try {
      const { subject, topics = [], duration, difficulty, startDate, endDate } = params;
      
      // Create a prompt that will work even without user-provided topics
      const prompt = `
        Generate a detailed study plan for the subject: ${subject}.
        
        Additional parameters:
        - Duration: ${duration} days
        - Difficulty Level: ${difficulty}
        - Start Date: ${startDate}
        - End Date: ${endDate}
        ${topics.length > 0 ? `- User-specified Topics: ${topics.join(", ")}` : ''}
        
        ${topics.length === 0 ? 'Please suggest appropriate topics for this subject based on the difficulty level.' : ''}
        
        Format the response as a JSON object with these fields:
        1. title (string): A title for the study plan
        2. description (string): Brief description of the study plan
        3. topics (array): List of main topics (as strings)
        4. schedule (array): Daily schedule with date, topics, and estimated hours
        5. resources (array): Recommended learning resources
        6. milestones (array): Key milestones or checkpoints
        
        Make it detailed but realistic for the given duration and difficulty.
        Just return the JSON object without any explanations.
      `;

      // Call Gemini API
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const textResponse = response.text();
      
      console.log("Gemini response:", textResponse);
      
      // Parse the JSON response
      // Find the JSON object in the response using regex
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse Gemini API response");
      }
    } catch (error) {
      console.error("Error generating study plan:", error);
      throw error;
    }
  }
}

module.exports = new GeminiService();