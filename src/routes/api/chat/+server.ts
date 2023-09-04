import { json } from '@sveltejs/kit';
import { sendMessage } from '../../../service/GPTService.js';

export async function POST({ request }) {
  const { message } = await request.json();
  const completion = await sendMessage(message)
  return json(completion, { status: 200 });
}
