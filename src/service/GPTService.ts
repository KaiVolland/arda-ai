import { OPENAI_API_KEY } from '$env/static/private'

import OpenAI from 'openai';
import { advice } from '../lib/default_advice';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
});

export async function sendMessage(message: string) {
  const content = `
    ${advice}
    ${message}
  `;
  const completion = await openai.chat.completions.create({
    messages: [
      {
      role: 'user',
      content
    }],
    model: 'gpt-3.5-turbo',
  });
  return completion;
}
