import * as vscode from "vscode";
import { DEFAULT_PROMPT } from "./prompt";
import OpenAI from "openai";
import { Repository } from "./api/git";
import { ClientConfig, getClientConfig } from "./config";

export async function generateCommitMessage(client: OpenAI, minifiedChanges: string, config: ClientConfig = getClientConfig()) {
    const response = await client.chat.completions.create({
        model: config.model,
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
        temperature: config.temperature,
        max_tokens: config.maxTokens,
        seed: config.seed,
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
