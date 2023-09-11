import { OPENAI_API_KEY } from '$env/static/private'
import { OPENAI_MODEL } from '$env/static/private'

import OpenAI from 'openai';
import { advice } from '../lib/default_advice';
import type { ChatCompletionMessage } from 'openai/resources/chat';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
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
    model: OPENAI_MODEL || 'gpt-3.5-turbo',
  });
  return completion;
}
