const { GoogleGenerativeAI } = require('@google/generative-ai');
const fetch = require('node-fetch');
global.fetch = fetch;

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
  
    const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });

    const prompt = `You are a support ticket classifier. Based on this request, choose EXACTLY ONE category:

IT - technical issues (computers, email, software, network, printers, access)
Billing - payments, invoices, charges, refunds
Feature Request - suggestions for new features or improvements
Bug - something broken that worked before, errors, crashes
Other - anything else

Return ONLY a JSON object with these fields:
{
  "category": "IT" or "Billing" or "Feature Request" or "Bug" or "Other",
  "priority": "High" or "Medium" or "Low",
  "summary": "one short sentence (max 12 words)",
  "draftResponse": "one sentence empathetic reply"
}

Request: "${description}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean and parse
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const data = JSON.parse(text);

    return {
      category: data.category || 'Other',
      priority: data.priority || 'Medium',
      summary: data.summary || description.substring(0, 100),
      draftResponse: data.draftResponse || 'Thank you for your request.'
    };
  } catch (err) {
    console.error('AI error:', err);
    return {
      category: 'Other',
      priority: 'Medium',
      summary: description.substring(0, 100),
      draftResponse: 'Thank you for your request.'
    };
  }
}

module.exports = { analyzeDescription };