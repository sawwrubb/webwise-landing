export type AiProvider = "openai";

export interface ScriptRequest {
  tenantId: string;
  system: string;
  user: string;
}

export interface ScriptResult {
  text: string;
  provider: string;
  reversible: true;
}

export async function runScript(req: ScriptRequest): Promise<ScriptResult> {
  const provider = (process.env.AI_PROVIDER || "openai") as AiProvider;
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return {
      text: `[demo draft for ${req.tenantId}] ${req.user.slice(0, 140)}`,
      provider: "demo",
      reversible: true,
    };
  }
  const model = process.env.AI_MODEL || "gpt-4.1-mini";
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: req.system },
        { role: "user", content: req.user },
      ],
      temperature: 0.2,
    }),
  });
  if (!res.ok) throw new Error("AI provider error");
  const json = (await res.json()) as { choices: { message: { content: string } }[] };
  return {
    text: json.choices[0]?.message?.content ?? "",
    provider,
    reversible: true,
  };
}
