import type { AiProfile } from "../../App";

export type AIProvider = 
    "Claude"
    | "Copilot"
    | "Gemini"
    | "Jules"
    | "Grok"
    | "CodeRabbit"
    | "Codex"
    | "Cursor"
    | "Devin"
    | "RoboClaw"
    | "ClawSweeper"
    | "TideClaw"
    | "OpenClaw-Mantis"
    | "OpenClaw-Clownfish"
    | "Codesmith"
    | "Dori"
    | "Charlie"
    | "Tambo"
    | "Trae"
    | "Adal"
    | "Kiro"
    | "RtBot"
    | "Compozy"
    | "Leeroo"
    | "Ouroboros"
    | "OpenHands"
    | "Paperclip"
    | "Speakeasy"
    | "AIDevBot"
    | "Amp"
    | "QoderAI"
    | "Loveable"
    | "KiloConnect"
    | "OpenCodeAgent"

export const aiEmails : Record<string, AIProvider> = {
    // Claude
    "noreply@anthropic.com": "Claude",
    "claude[bot]@users.noreply.github.com" : "Claude",
    // Copilot
    "Copilot@users.noreply.github.com": "Copilot",
    // Gemini
    "gemini-code-assist@users.noreply.github.com": "Gemini",
    "gemini-cli@google.com": "Gemini",
    // Jules
    "google-labs-jules[bot]@users.noreply.github.com": "Jules",
    // Grok
    "noreply@x.ai": "Grok",
    // CodeRabbit
    "coderabbitai@users.noreply.github.com": "CodeRabbit",
    "coderabbitai[bot]@users.noreply.github.com": "CodeRabbit",
    "actions@coderabbit.ai": "CodeRabbit",
    // Codex
    "noreply@openai.com": "Codex",
    "chatgpt-codex-connector[bot]@users.noreply.github.com": "Codex",
    // Cursor
    "cursoragent@cursor.com": "Cursor",
    "cursor[bot]@users.noreply.github.com": "Cursor",
    // Devin
    "devin-ai-integration[bot]@users.noreply.github.com": "Devin",
    // RoboClaw
    "roboclaw@openclaw.org": "RoboClaw",
    // ClawSweeper
    "clawsweeper@gmail.com": "ClawSweeper",
    "clawsweeper[bot]@users.noreply.github.com": "ClawSweeper",
    // TideClaw
    "tideclaw-bot@users.noreply.github.com": "TideClaw",
    // Openclaw-Mantis
    "openclaw-mantis[bot]@users.noreply.github.com": "OpenClaw-Mantis",
    // Openclaw-Clownfish
    "openclaw-clownfish[bot]@users.noreply.github.com": "OpenClaw-Clownfish",
    // Codesmith
    "codesmith@blacksmith.sh" : "Codesmith",
    "codesmith-bot@users.noreply.github.com": "Codesmith",
    "blacksmith-sh[bot]@users.noreply.github.com": "Codesmith",
    // Dori
    "sisyphus-dev-ai@users.noreply.github.com": "Dori",
    // Charlie
    "charliecreates[bot]@users.noreply.github.com": "Charlie",
    "charlie@charlielabs.ai": "Charlie",
    // Tambo
    "tambo-automations[bot]@users.noreply.github.com": "Tambo",
    "bots@tambo.co": "Tambo",
    // Trae
    "trae-agent@users.noreply.github.com": "Trae",
    // Adal
    "adal@sylph.ai": "Adal",
    // Kiro
    "kiro-agent@users.noreply.github.com": "Kiro",
    // RtBot
    "rtBot@users.noreply.github.com": "RtBot",
    // Compozy
    "pedro@compozy.com": "Compozy",
    "compozybot@users.noreply.github.com": "Compozy",
    // Leeroo
    "leerooadmin@leeroo.com": "Leeroo",
    // Ouroboros
    "ouroboros@gmail.com": "Ouroboros",
    "ouroboros-agent@users.noreply.github.com": "Ouroboros",
    // OpenHands
    "openhands@all-hands.dev": "OpenHands",
    "contact@all-hands.dev": "OpenHands",
    "allhands-bot@users.noreply.github.com": "OpenHands",
    // Paperclip
    "noreply@paperclip.ing": "Paperclip",
    // Speakeasy
    "bot@speakeasyapi.dev": "Speakeasy",
    // AIDevBot
    "aidevbot@users.noreply.github.com": "AIDevBot",
    // Amp
    "amp@ampcode.com": "Amp",
    // QoderAI
    "qoderai[bot]@users.noreply.github.com": "QoderAI",
    // Loveable
    "gpt-engineer-app[bot]@users.noreply.github.com": "Loveable",
    // KiloConnect
    "kilo-maintainer[bot]@users.noreply.github.com": "KiloConnect",
    "kiloconnect[bot]@users.noreply.github.com": "KiloConnect",
    // OpenCodeAgent
    "opencode-agent[bot]@users.noreply.github.com": "OpenCodeAgent",
}

export const aiProfiles : Record<AIProvider, AiProfile> = {
    Claude: {
        avatarSrc: "https://avatars.githubusercontent.com/u/81847"
    },
    Copilot: {
        avatarSrc: "https://avatars.githubusercontent.com/in/1143301"
    },
    Gemini: {
        avatarSrc: "https://avatars.githubusercontent.com/u/200291788"
    },
    Jules: {
        avatarSrc: "https://avatars.githubusercontent.com/in/842251"
    },
    Grok: {
        avatarSrc: "https://avatars.githubusercontent.com/in/1143301"
    },
    CodeRabbit: {
        avatarSrc: "https://avatars.githubusercontent.com/in/347564"
    },
    Codex: {
        avatarSrc: "https://avatars.githubusercontent.com/u/267193182"
    },
    Cursor: {
        avatarSrc: "https://avatars.githubusercontent.com/u/199161495"
    },
    Devin: {
        avatarSrc: "https://avatars.githubusercontent.com/in/811515"
    },
    RoboClaw: {
        avatarSrc: "https://avatars.githubusercontent.com/u/309084314"
    },
    ClawSweeper: {
        avatarSrc: "https://avatars.githubusercontent.com/u/280513762"
    },
    TideClaw: {
        avatarSrc: "https://avatars.githubusercontent.com/u/346684585"
    },
    "OpenClaw-Mantis": {
        avatarSrc: "https://avatars.githubusercontent.com/in/3588624"
    },
    "OpenClaw-Clownfish": {
        avatarSrc: "https://avatars.githubusercontent.com/in/3535277"
    },
    Codesmith: {
        avatarSrc: "https://avatars.githubusercontent.com/u/267743959"
    },
    Dori: {
        avatarSrc: "https://avatars.githubusercontent.com/u/238992291"
    },
    Charlie: {
        avatarSrc: "https://avatars.githubusercontent.com/u/197835787"
    },
    Tambo: {
        avatarSrc: "https://avatars.githubusercontent.com/u/230265268"
    },
    Trae: {
        avatarSrc: "https://avatars.githubusercontent.com/u/220387035"
    },
    Adal: {
        avatarSrc: "https://avatars.githubusercontent.com/u/248968518"
    },
    Kiro: {
        avatarSrc: "https://avatars.githubusercontent.com/u/244629292"
    },
    RtBot: {
        avatarSrc: "https://avatars.githubusercontent.com/u/43742164"
    },
    Compozy: {
        avatarSrc: "https://avatars.githubusercontent.com/u/248236658"
    },
    Leeroo: {
        avatarSrc: "https://avatars.githubusercontent.com/u/232216315"
    },
    Ouroboros: {
        avatarSrc: "https://avatars.githubusercontent.com/u/311266734"
    },
    OpenHands: {
        avatarSrc: "https://avatars.githubusercontent.com/u/175740463"
    },
    Paperclip: {
        avatarSrc: "https://avatars.githubusercontent.com/u/271391591"
    },
    Speakeasy: {
        avatarSrc: "https://avatars.githubusercontent.com/u/108416695"
    },
    AIDevBot: {
        avatarSrc: "https://avatars.githubusercontent.com/u/157669933"
    },
    Amp: {
        avatarSrc: "https://avatars.githubusercontent.com/u/289058786"
    },
    QoderAI: {
        avatarSrc: "https://avatars.githubusercontent.com/in/1396158"
    },
    Loveable: {
        avatarSrc: "https://avatars.githubusercontent.com/in/818760"
    },
    KiloConnect: {
        avatarSrc: "https://avatars.githubusercontent.com/in/2837726"
    },
    OpenCodeAgent: {
        avatarSrc: "https://avatars.githubusercontent.com/in/1549082"
    }
}

export function CheckAiEmail(email : string = "" ) : AIProvider
{
    return aiEmails[email ?? ""]
}

export function GetAIProfile(ai : AIProvider | string) : AiProfile
{
    return aiProfiles[ai as AIProvider];
}