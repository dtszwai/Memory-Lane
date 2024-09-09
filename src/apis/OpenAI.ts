import OpenAI from "openai";

interface GenerateTextProps {
  age?: string;
  location?: string;
  imageUrl: string;
  date: Date;
  words?: number;
}

const key = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

export const getNarrative = async ({
  location,
  date,
  imageUrl,
  words = 100,
}: GenerateTextProps) => {
  if (!key) {
    throw new Error("OpenAI API key is missing");
  }
  const openai = new OpenAI({ apiKey: key });

  const systemPrompt = [
    `You are the narrator of a movie for a person.`,
    location ? `is currently in ${location} on ${date.toDateString()}.` : "",
    `When you receive an image, write a narrative from the perspective of the person of ${words} words in the style of Charles Bukowski.`,
    `Focus on describing what is happening and what can be inferred from the image.`,
    `Keep the narrative grounded in reality, avoiding excessive speculation.`,
    `The narrative should always be in the third person.`,
    "",
  ].join(" ");

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: [{ type: "image_url", image_url: { url: imageUrl } }],
      },
    ],
  });

  const narrative = response.choices[0].message.content;
  if (!narrative) {
    throw new Error("Narrative not found");
  }

  return narrative;
};
