import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const SYSTEM = 'Esti un AI companion empatic. Raspunzi scurt, fara judecata.';
export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const response = await client.messages.create({ model: 'claude-haiku-4-5-20251001', max_tokens: 500, system: SYSTEM, messages });
    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    return NextResponse.json({ reply: text });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
