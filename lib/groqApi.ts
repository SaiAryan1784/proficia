interface GenerateTestParams {
  topic: string;
  description: string;
  difficulty: string;
  questionCount: number;
}

interface GroqTestQuestion {
  text: string;
  type: "MULTIPLE_CHOICE" | "TEXT" | "TRUE_FALSE";
  options?: string[];
  correctAnswer: string;
  explanation?: string;
}

interface GroqTestResponse {
  questions: GroqTestQuestion[];
}

export async function generateTestWithGroq({
  topic,
  description,
  difficulty,
  questionCount
}: GenerateTestParams): Promise<GroqTestResponse> {
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  
  if (!GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not defined in environment variables');
  }

  const promptTemplate = `
    You are an expert educator and test creator. Create a ${difficulty} difficulty test on the topic of "${topic}".
    
    Topic details: ${description}
    
    Generate ${questionCount} multiple-choice questions with 4 options each. For each question:
    1. Provide a clear, well-formulated question
    2. Provide 4 distinct answer options labeled A, B, C, and D
    3. Indicate which option is correct
    4. Provide a brief explanation of why the correct answer is right

    Format your response as a JSON object with the following structure:
    {
      "questions": [
        {
          "text": "question text here",
          "type": "MULTIPLE_CHOICE",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": "Option A",
          "explanation": "explanation here"
        },
        // more questions...
      ]
    }
    
    Make sure your questions test understanding rather than just memorization.
  `;

  try {
    console.log(`Sending request to Groq API for topic: ${topic}`);
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192', // Updated to correct model name
        messages: [
          {
            role: 'system',
            content: 'You are an expert test creator that always responds with properly formatted JSON.'
          },
          {
            role: 'user',
            content: promptTemplate
          }
        ],
        temperature: 0.2,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Groq API error: ${response.status} - ${errorText}`);
      throw new Error(`Groq API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("Groq API response received:", data);
    
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      console.error("Empty content in Groq API response");
      throw new Error('Empty response from Groq API');
    }
    
    let parsedContent;
    try {
      // Check if content is already a JSON object or a string that needs parsing
      parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
      console.log("Successfully parsed content:", parsedContent);
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError);
      console.error("Raw content:", content);
      throw new Error('Invalid JSON response from Groq API');
    }
    
    // Verify the structure of the parsed content
    if (!parsedContent.questions || !Array.isArray(parsedContent.questions)) {
      console.error("Malformed response - questions array not found:", parsedContent);
      throw new Error('Malformed response from Groq API - questions array not found');
    }
    
    return parsedContent;
  } catch (error) {
    console.error('Error generating test with Groq:', error);
    
    // Fallback to sample questions in case of API error
    return {
      questions: Array.from({ length: questionCount }, (_, i) => ({
        text: `Sample question ${i + 1} about ${topic} (${difficulty} difficulty)`,
        type: "MULTIPLE_CHOICE" as const,
        options: [
          "Option A",
          "Option B",
          "Option C",
          "Option D"
        ],
        correctAnswer: "Option A",
        explanation: "This is a sample explanation for the correct answer."
      }))
    };
  }
} 