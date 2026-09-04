import { MODELS } from '../catalog';
import type { ModelSpec } from '../types';

export function getModel(id?: string): ModelSpec {
  const found = MODELS.find((m) => m.id === id || m.alias === id);
  return found || MODELS[0];
}

export function providerReady(provider: ModelSpec['provider']): boolean {
  if (provider === 'openai') return Boolean(process.env.OPENAI_API_KEY);
  if (provider === 'anthropic') return Boolean(process.env.ANTHROPIC_API_KEY);
  if (provider === 'google') return Boolean(process.env.GOOGLE_API_KEY);
  if (provider === 'perplexity') return Boolean(process.env.PERPLEXITY_API_KEY);
  if (provider === 'qwen') return Boolean(process.env.QWEN_API_KEY);
  return false;
}

export async function completeWithModel(model: ModelSpec, system: string, user: string): Promise<{ text: string; live: boolean; source: string }> {
  if (model.provider === 'openai' && process.env.OPENAI_API_KEY) {
    const apiModel = process.env.OPENAI_MODEL || model.apiModel;
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: apiModel,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        temperature: 0.2,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`OpenAI error ${res.status}: ${err}`);
    }
    const json: any = await res.json();
    return {
      text: json.choices?.[0]?.message?.content || '',
      live: true,
      source: `OpenAI API · ${apiModel}`,
    };
  }

  return {
    text: '',
    live: false,
    source: `${model.name} (${model.apiModel}) — local orchestration (no live key). Intelligence would come from this model when configured.`,
  };
}

export function modelGatewayStatus() {
  return MODELS.map((m) => ({
    ...m,
    live: providerReady(m.provider),
    note:
      m.id === 'gpt-5.6-sol'
        ? 'Available through the OpenAI API as gpt-5.6-sol, with gpt-5.6 as its alias. Artifacts can use any model available to the configured Agent.'
        : 'Attach via LibreChat model gateway. A child Agent can use a different model than its parent.',
  }));
}
