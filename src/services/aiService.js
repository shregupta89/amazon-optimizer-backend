const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function optimizeListing(original) {
  try {
    const prompt = `You are an Amazon listing optimization expert. Given the following product listing, improve it:

ORIGINAL TITLE:
${original.title}

ORIGINAL BULLET POINTS:
${original.bullets}

ORIGINAL DESCRIPTION:
${original.description}

Please provide:
1. An improved title (keyword-rich, under 200 characters, readable)
2. Rewritten bullet points (clear, concise, benefit-focused - 5 points)
3. Enhanced description (persuasive, compliant with Amazon guidelines)
4. 3-5 new keyword suggestions

Format your response as JSON:
{
  "title": "improved title here",
  "bullets": "bullet 1\\nbullet 2\\nbullet 3\\nbullet 4\\nbullet 5",
  "description": "enhanced description here",
  "keywords": "keyword1, keyword2, keyword3, keyword4, keyword5"
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const optimized = JSON.parse(response.choices[0].message.content);
    return optimized;
  } catch (error) {
    throw new Error(`AI optimization failed: ${error.message}`);
  }
}

module.exports = { optimizeListing };