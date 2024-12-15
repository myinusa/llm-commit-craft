import * as vscode from "vscode";
import { LLM_MODEL, LLM_TEMPERATURE, LLM_MAX_TOKENS, LLM_SEED, LLM_BASE_URL } from "./constants";

export interface ClientConfig {
    url: string;
    model: string;
    temperature: number;
    maxTokens: number;
    seed: number;
}

export function getClientConfig(): ClientConfig {
    const config = vscode.workspace.getConfiguration("llmCommitCraft");
    return {
        url: config.get<string>("url", LLM_BASE_URL),
        model: config.get<string>("model", LLM_MODEL),
        temperature: config.get<number>("temperature", LLM_TEMPERATURE),
        maxTokens: config.get<number>("maxTokens", LLM_MAX_TOKENS),
        seed: config.get<number>("seed", LLM_SEED),
    };
}
