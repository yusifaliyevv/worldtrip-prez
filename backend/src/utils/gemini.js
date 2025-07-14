import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function askGeminiForItinerary({ destination, budget, days, startDate }) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

    const prompt = `
Create a clean and well-organized ${days}-day travel itinerary for ${destination}.

Use exactly this format:

Day 1: ${destination} – [Theme/Focus] (${startDate})

• 09:00–10:00 : [Activity Name – in original language]

[Brief description in English]

Cost: $XX per person

• 10:00–11:00 : [Activity Name – in original language]

[Brief description in English]

Cost: $XX per person

• 11:00–12:00 : [Activity Name – in original language]

[Brief description in English]

Cost: $XX per person

• 12:00–13:00 : Lunch

Location: [Restaurant name in original language] – [specialty in English]

Cost: $XX per person

• 13:00–16:00 : [Activity Name – in original language]

[Brief description in English]

Entry Fee: $XX per person

• 16:00–17:00 : [Activity Name – in original language]

[Brief description in English]

Cost: $XX per person

• 17:00–18:00 : [Activity Name – in original language]

[Brief description in English]

• 18:00–19:30 : Dinner

Location: [Restaurant name in original language] – [specialty in English]

Cost: $XX per person

• 19:30–21:00 : [Evening activity – in original language]

[Brief description in English]

• 21:00 : [Final activity – in original language]

Day 2: ${destination} – [Theme/Focus] (next date)

• 09:00–10:00 : [Activity Name – in original language]

[Brief description in English]

Cost: $XX per person

[Continue this format for all ${days} days...]

Requirements:

Hotel recommendations with price ranges and booking links

Local SIM cards or WiFi options

Weather-appropriate packing lists

Emergency contacts and embassy information

Budget: ${budget} USD total

Use original language for place names (e.g., Tower of London, Louvre Museum)

Descriptions and explanations must be in English

Only show cost per person, do not calculate totals

Include key landmarks, local food, and transportation

No unnecessary introduction or conclusion

Separate days with a horizontal line
    `.trim();

    const result = await model.generateContentStream({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {},
      safetySettings: [],
    });

    let answer = '';
    for await (const chunk of result.stream) {
      if (chunk.text()) answer += chunk.text();
    }

    return answer;
  } catch (error) {
    console.error('Gemini error:', error);
    return 'Something went wrong generating your travel plan.';
  }
}