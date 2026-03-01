const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Gemini client with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Analyze a support request description using Gemini and return
 * the parsed fields needed by the application.
 *
 * @param {string} description - full text of the user request
 * @returns {Promise<{
 *   category: string,
 *   priority: string,
 *   summary: string,
 *   draftResponse: string
 * }>} parsed AI results (with defaults if AI fails)
 */
async function analyzeDescription(description) {
  try {
    const prompt = `You are an AI assistant for a service request system. Analyze the support request below and classify it into EXACTLY ONE of these categories:

CATEGORIES (choose exactly one):
- "IT": Technical issues with computers, email, software, network, printers, access problems
- "Billing": Payment issues, invoices, charges, refunds, subscription questions
- "Feature Request": Suggestions for new features, improvements, enhancements
- "Bug": Something that worked before but now broken, errors, crashes, unexpected behavior
- "Other": Anything that doesn't fit above

PRIORITY (choose exactly one):
- "High": Urgent, blocking work, deadline imminent, critical system down
- "Medium": Important but not urgent, workaround exists, affecting productivity
- "Low": Questions, minor issues, nice-to-have, informational

Then provide:
- summary: ONE short sentence (max 15 words) capturing the core issue
- draftResponse: A specific, empathetic FIRST RESPONSE that an admin could send

Return ONLY a valid JSON object with these exact keys: category, priority, summary, draftResponse

Examples:
Input: "My email isn't working since this morning, I have a client meeting in 1 hour"
Output: {"category":"IT","priority":"High","summary":"Email down, urgent client meeting in 1 hour","draftResponse":"I'm sorry you're having email issues before your meeting. I'll prioritize this and get back to you within 30 minutes."}

Input: "Can you add a dark mode to the dashboard?"
Output: {"category":"Feature Request","priority":"Low","summary":"Feature request: dark mode for dashboard","draftResponse":"Thanks for the suggestion! I've logged this feature request for our team to consider."}

Input: "I was charged twice for my subscription this month"
Output: {"category":"Billing","priority":"Medium","summary":"Duplicate charge on subscription","draftResponse":"I apologize for the double charge. Let me check your account and process a refund."}

Input: "The report generator crashes when I select last month's data"
Output: {"category":"Bug","priority":"High","summary":"Report generator crashes with last month's data","draftResponse":"I'm sorry the report generator is crashing. This is affecting your work. I'll escalate this to our engineering team immediately."}

Now analyze this request:
"""${description}"""

Remember: Return ONLY the JSON object, no other text.`;

    // Get the model - using flash for faster responses
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean the response (remove markdown code blocks if present)
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Parse JSON
    const data = JSON.parse(text);
    
    // Validate and return with defaults if any field missing
    return {
      category: data.category || 'Other',
      priority: data.priority || 'Medium',
      summary: data.summary || description.substring(0, 100) + '...',
      draftResponse: data.draftResponse || 'Thank you for your request. Our team will review it shortly.'
    };
    
  } catch (err) {
    console.error('❌ AI analysis error:', err);
    // Return safe defaults if AI fails
    return {
      category: 'Other',
      priority: 'Medium',
      summary: description.substring(0, 100) + '...',
      draftResponse: 'Thank you for your request. Our team will review it shortly.'
    };
  }
}

module.exports = { analyzeDescription };