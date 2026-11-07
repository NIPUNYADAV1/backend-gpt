import dotenv from 'dotenv';

dotenv.config();

const getOpenAIResponse = async (message) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`
        },
        body: JSON.stringify({
            model: 'openai/gpt-4o-mini',
            messages: [
                {
                    role: 'user',
                    content: message
                }
            ]
        })
    };

    try {
        const response = await fetch(
            'https://openrouter.ai/api/v1/chat/completions',
            options
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error?.message || `API error: ${response.status}`
            );
        }

        const content = data.choices?.[0]?.message?.content;

        if (!content) {
            throw new Error('No chatbot response returned by the API');
        }

        return content;
    } catch (err) {
        console.error('OpenRouter error:', err.message);
        throw err;
    }
};

export default getOpenAIResponse;