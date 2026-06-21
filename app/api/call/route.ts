import { NextRequest, NextResponse } from "next/server";
import { getProfile, installerName } from "@/lib/profiles";
import type { VisionBrief } from "@/lib/vision";

type CallMode = "brief" | "detailed";

const openRouterModel = "anthropic/claude-opus-4.8";
const elevenModel = "eleven_v3";
const defaultVoiceId = "21m00Tcm4TlvDq8ikWAM";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    profileId?: string;
    brief?: VisionBrief;
    mode?: CallMode;
  } | null;
  const profile = getProfile(body?.profileId ?? "");
  const mode: CallMode = body?.mode === "detailed" ? "detailed" : "brief";
  const script = await buildCallScript(profile, mode, body?.brief);
  const elevenKey = process.env.ELEVENLABS_API_KEY;

  if (!elevenKey) {
    return NextResponse.json({
      status: "script-only",
      missingEnv: "ELEVENLABS_API_KEY",
      mode,
      script
    });
  }

  const voiceId = process.env.ELEVENLABS_VOICE_ID ?? defaultVoiceId;
  const audio = await renderSpeech(script.voiceText, elevenKey, voiceId);

  if (!audio.ok) {
    return NextResponse.json({
      status: "script-only",
      mode,
      script,
      audioError: audio.error
    });
  }

  return NextResponse.json({
    status: "audio-ready",
    mode,
    script,
    audioBase64: Buffer.from(audio.buffer).toString("base64"),
    mimeType: "audio/mpeg",
    elevenModel: process.env.ELEVENLABS_MODEL ?? elevenModel,
    voiceId
  });
}

async function buildCallScript(
  profile: ReturnType<typeof getProfile>,
  mode: CallMode,
  brief?: VisionBrief
) {
  const fallback = fallbackScript(profile, mode, brief);
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return fallback;
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://energistria.vercel.app",
        "X-Title": "Energistria"
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_CALL_MODEL ?? process.env.OPENROUTER_MODEL ?? openRouterModel,
        messages: [
          {
            role: "system",
            content:
              "You are an elite residential solar sales call writer. Produce specific, humane, high-converting scripts grounded in evidence. Avoid generic AI sales language."
          },
          {
            role: "user",
            content: [
              `Installer: ${installerName}`,
              `Customer: ${profile.name}`,
              `Address: ${profile.address}`,
              `Archetype: ${profile.archetype}`,
              `Mode: ${mode}`,
              `Quote: ${profile.quote.systemKw} kW PV, ${profile.quote.batteryKwh} kWh battery, €${profile.quote.monthlySaving}/mo saving, ${profile.quote.paybackYears} year payback`,
              `Visual headline: ${brief?.headline ?? profile.visualEvidence.bestArgument}`,
              `Argument: ${brief?.argument ?? profile.visualEvidence.bestArgument}`,
              `Caution: ${brief?.caution ?? profile.visualEvidence.risk}`,
              `Known call coaching: ${profile.outreach.callLine}`,
              "Return strict JSON only: {\"title\":\"string\",\"duration\":\"string\",\"repGoal\":\"string\",\"voiceText\":\"string\",\"objectionHandle\":\"string\",\"nextStep\":\"string\"}.",
              mode === "brief"
                ? "Write a realistic 35-50 second voicemail/follow-up call. Use natural pauses, one sharp evidence hook, one question, and a low-pressure next step."
                : "Write a realistic 2-3 minute discovery call track. Include opener, permission question, evidence hook, one objection handle, one clear technical caveat, and close. It should sound like a skilled human rep, not a pitch deck.",
              "For voiceText, include subtle ElevenLabs v3-style delivery cues in square brackets, such as [warm], [small pause], [lower voice], [light laugh], but do not overdo them.",
              "Do not mention model names, APIs, or internal tooling."
            ].join("\n")
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.35,
        max_tokens: mode === "brief" ? 900 : 1800
      })
    });

    if (!response.ok) {
      return fallback;
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    return normalizeScript(JSON.parse(cleanJson(data.choices?.[0]?.message?.content ?? "")), fallback);
  } catch {
    return fallback;
  }
}

async function renderSpeech(text: string, apiKey: string, voiceId: string) {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text,
        model_id: process.env.ELEVENLABS_MODEL ?? elevenModel,
        voice_settings: {
          stability: 0.38,
          similarity_boost: 0.82,
          style: 0.72,
          use_speaker_boost: true
        }
      })
    }
  );

  if (!response.ok) {
    return { ok: false as const, error: `ElevenLabs returned ${response.status}` };
  }

  return { ok: true as const, buffer: await response.arrayBuffer() };
}

function fallbackScript(profile: ReturnType<typeof getProfile>, mode: CallMode, brief?: VisionBrief) {
  const hook = brief?.argument ?? profile.visualEvidence.bestArgument;
  const caveat = brief?.caution ?? profile.visualEvidence.risk;

  if (mode === "brief") {
    return {
      title: "Brief call",
      duration: "45 sec",
      repGoal: "Get permission for one short technical follow-up.",
      voiceText: `[warm] Hi ${profile.name.split(" ")[0]}, this is ${installerName}. [small pause] I looked at the imagery around ${profile.address}, and the interesting part is this: ${hook} [small pause] I do not want to overstate it; ${caveat} But I think there is a concrete next step here. Could I send you the short version with the roof evidence and one conservative number to check?`,
      objectionHandle: caveat,
      nextStep: profile.outreach.cta
    };
  }

  return {
    title: "Detailed call",
    duration: "2 min",
    repGoal: "Turn the visual evidence into a reason to reopen the quote.",
    voiceText: `[warm] Hi ${profile.name.split(" ")[0]}, this is ${installerName}. Before we talk numbers, can I frame why I am calling? [small pause] We compared the recent imagery around ${profile.address} with older archive frames. The useful thing is not just that solar might work there. It is that ${hook} [lower voice] The honest caveat is this: ${caveat} [small pause] So I would not sell this as a generic panel package. I would sell it as a specific decision: ${profile.quote.systemKw} kilowatts, ${profile.quote.batteryKwh} kilowatt hours of battery, roughly ${profile.quote.monthlySaving} euros monthly savings in the current quote, and a conservative path to verify the roof assumptions. [small pause] If your concern is disruption or overpromising, I agree with that concern. The next step should be small: we send the marked image, the assumptions, and one clean option to accept or reject. Does that sound fair?`,
    objectionHandle: caveat,
    nextStep: profile.outreach.cta
  };
}

function normalizeScript(value: unknown, fallback: ReturnType<typeof fallbackScript>) {
  if (!value || typeof value !== "object") {
    return fallback;
  }

  const script = value as Partial<ReturnType<typeof fallbackScript>>;
  return {
    title: typeof script.title === "string" ? script.title : fallback.title,
    duration: typeof script.duration === "string" ? script.duration : fallback.duration,
    repGoal: typeof script.repGoal === "string" ? script.repGoal : fallback.repGoal,
    voiceText: typeof script.voiceText === "string" ? script.voiceText : fallback.voiceText,
    objectionHandle:
      typeof script.objectionHandle === "string" ? script.objectionHandle : fallback.objectionHandle,
    nextStep: typeof script.nextStep === "string" ? script.nextStep : fallback.nextStep
  };
}

function cleanJson(content: string) {
  return content
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "");
}
