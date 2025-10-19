const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function optimizeListing(original) {
  console.log('[AIService] Starting listing optimization for ASIN:', original.asin);
  console.log('[AIService] Input data:', {
    titleLength: original.title?.length || 0,
    bulletsLength: original.bullets?.length || 0,
    descriptionLength: original.description?.length || 0
  });
  
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

    console.log('[AIService] Prompt created, length:', prompt.length);
    console.log('[AIService] Calling OpenAI API with model: gpt-4o-mini');
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    console.log('[AIService] OpenAI response received:', {
      finishReason: response.choices[0]?.finish_reason,
      hasContent: !!response.choices[0]?.message?.content,
      contentLength: response.choices[0]?.message?.content?.length || 0,
      usage: response.usage
    });

    const responseContent = response.choices[0].message.content;
    console.log('[AIService] Raw response content preview:', responseContent.substring(0, 200) + '...');
    
    const optimized = JSON.parse(responseContent);
    
    console.log('[AIService] Successfully parsed optimization result:', {
      hasTitle: !!optimized.title,
      hasBullets: !!optimized.bullets,
      hasDescription: !!optimized.description,
      hasKeywords: !!optimized.keywords,
      titleLength: optimized.title?.length || 0,
      keywordCount: optimized.keywords?.split(',').length || 0
    });
    
    return optimized;
  } catch (error) {
    console.error('[AIService] Error during optimization:', {
      errorMessage: error.message,
      errorType: error.constructor.name,
      errorCode: error.code,
      errorStatus: error.status,
      errorResponse: error.response?.data
    });
    
    if (error instanceof SyntaxError) {
      console.error('[AIService] JSON parsing error - invalid response format');
    }
    
    throw new Error(`AI optimization failed: ${error.message}`);
  }
}

module.exports = { optimizeListing };