import { env } from '$env/dynamic/private'

import OpenAI from 'openai';
import { advice } from '../lib/default_advice';
import type { ChatCompletionMessage } from 'openai/resources/chat';

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY
});

export async function sendMessage(message: string, previousMessages: ChatCompletionMessage[] = []) {
  const content = `
    ${advice}
    ${message}
  `;

  const completion = await openai.chat.completions.create({
    messages: [
      ...previousMessages,
      {
        role: 'user',
        content
      }
    ],
    model: env.OPENAI_MODEL || 'gpt-3.5-turbo',
  });
  return completion;
}
