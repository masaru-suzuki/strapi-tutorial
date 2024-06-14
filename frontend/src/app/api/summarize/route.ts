import { NextRequest } from 'next/server';

import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

import { fetchTranscript } from '@/lib/youtube-transcript';
import { getUserMeLoader } from '@/data/services/get-user-me-loader';
import { getAuthToken } from '@/data/services/get-token';

function transformData(data: any[]) {
  let text = '';

  data.forEach((item) => {
    text += item.text + ' ';
  });

  return {
    data: data,
    text: text.trim(),
  };
}

const TEMPLATE = `
指示:
  この{text}に対して以下の手順を完了してください。
  提供された内容に基づいてタイトルを生成します。
  以下の内容を要約し、5つの重要なトピックを含め、通常の口調で一人称で書いてください。

  YouTube動画の説明を書いてください
    - 見出しとセクションを含める。
    - キーワードと重要なポイントを組み込む

  重要なポイントと利益の箇条書きリストを生成する

  可能性のあるおよび最も推奨されるキーワードを返す
`;

async function generateSummary(content: string, template: string) {
  const prompt = PromptTemplate.fromTemplate(template);

  const model = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: process.env.OPENAI_MODEL ?? 'gpt-3.5-turbo',
    temperature: process.env.OPENAI_TEMPERATURE
      ? parseFloat(process.env.OPENAI_TEMPERATURE)
      : 0.7,
    maxTokens: process.env.OPENAI_MAX_TOKENS
      ? parseInt(process.env.OPENAI_MAX_TOKENS)
      : 4000,
  });

  const outputParser = new StringOutputParser();
  const chain = prompt.pipe(model).pipe(outputParser);

  try {
    const summary = await chain.invoke({ text: content });
    return summary;
  } catch (error) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }));
    }
    return new Response(
      JSON.stringify({ error: 'Failed to generate summary.' })
    );
  }
}

export async function POST(req: NextRequest) {
  const user = await getUserMeLoader();
  const token = await getAuthToken();

  if (!user.ok || !token)
    return new Response(
      JSON.stringify({ data: null, error: 'Not authenticated' }),
      { status: 401 }
    );

  if (user.data.credits < 1)
    return new Response(
      JSON.stringify({
        data: null,
        error: 'Insufficient credits',
      }),
      { status: 402 }
    );

  const body = await req.json();
  const { videoId } = body;

  let transcript: Awaited<ReturnType<typeof fetchTranscript>>;

  try {
    transcript = await fetchTranscript(videoId);
    const transformedData = transformData(transcript);
    let summary: Awaited<ReturnType<typeof generateSummary>>;

    summary = await generateSummary(transformedData.text, TEMPLATE);
    return new Response(JSON.stringify({ data: summary, error: null }));
  } catch (error) {
    console.error('Error processing request:', error);
    if (error instanceof Error)
      return new Response(JSON.stringify({ error: error }));
    return new Response(JSON.stringify({ error: 'Unknown error' }));
  }
}
