import * as vscode from "vscode";
import { DEFAULT_PROMPT } from "./test/prompt";
import { LLM_MODEL, LLM_TEMPERATURE, LLM_MAX_TOKENS, LLM_SEED } from "./constants";
import OpenAI from "openai";
import { Repository } from "./api/git";

export async function generateCommitMessage(client: OpenAI, minifiedChanges: string) {
    const response = await client.chat.completions.create({
        model: LLM_MODEL,
        messages: [
            {
                role: "system",
                content: DEFAULT_PROMPT,
            },
            {
                role: "user",
                content: `${minifiedChanges}`,
            },
        ],
        temperature: LLM_TEMPERATURE,
        max_tokens: LLM_MAX_TOKENS,
        seed: LLM_SEED,
        stream: false,
    });
    return response.choices[0].message.content ?? "";
}

export function setCommitMessage(repo: Repository, commitMessage: string) {
    try {
        vscode.commands.executeCommand("workbench.view.scm");
        const inputBox = repo.inputBox;
        if (inputBox) {
            inputBox.value = "";
            inputBox.value = commitMessage;
        } else {
            throw new Error("Source control input box is not available.");
        }
    } catch (error: unknown) {
        const error_ = error as Error;
        vscode.window.showErrorMessage(`Failed to set commit message: ${error_.message}`);
        console.error("Error setting commit message:", error);
    }
}
