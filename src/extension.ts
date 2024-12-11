import * as vscode from "vscode";
import OpenAI from "openai";
import { LLM_BASE_URL } from "./constants";
import { getGitAPI, getStagedChanges } from "./source-control";
import { generateCommitMessage, setCommitMessage } from "./commit-message";
import { handleError } from "./error-handle";

export function activate(context: vscode.ExtensionContext) {
    const disposableLogStagedChanges = vscode.commands.registerCommand("llm-commit-craft.logStagedChanges", async () => {
        try {
            const client = new OpenAI({
                baseURL: LLM_BASE_URL,
                apiKey: "",
            });

            const api = getGitAPI();
            const repo = api.repositories[0];
            if (!repo) {
                throw new Error("No repository found.");
            }

            const minifiedChanges = await getStagedChanges(repo);
            const commitMessage = await generateCommitMessage(client, minifiedChanges);
            setCommitMessage(repo, commitMessage);
        } catch (error: unknown) {
            handleError(error, "Error logging staged changes");
        }
    });

    context.subscriptions.push(disposableLogStagedChanges);
}

// This method is called when your extension is deactivated
export function deactivate() {}
