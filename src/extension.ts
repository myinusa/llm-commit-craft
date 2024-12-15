import * as vscode from "vscode";
import OpenAI from "openai";
import { LLM_BASE_URL } from "./constants";
import { getGitAPI, getStagedChanges } from "./source-control";
import { generateCommitMessage, setCommitMessage } from "./commit-message";
import { handleError } from "./error-handle";

export function activate(context: vscode.ExtensionContext) {
    const disposableLogStagedChanges = vscode.commands.registerCommand("llm-commit-craft.logStagedChanges", async () => {
        try {
            await vscode.window.withProgress(
                {
                    location: vscode.ProgressLocation.Notification,
                    title: "Logging Staged Changes",
                    cancellable: false,
                },
                async (progress) => {
                    progress.report({ increment: 0 });

                    const client = new OpenAI({
                        baseURL: LLM_BASE_URL,
                        apiKey: "",
                    });

                    progress.report({ increment: 20, message: "Initialized OpenAI client" });

                    const api = getGitAPI();
                    const repo = api.repositories[0];
                    if (!repo) {
                        throw new Error("No repository found.");
                    }

                    progress.report({ increment: 40, message: "Fetched repository" });

                    const minifiedChanges = await getStagedChanges(repo);
                    progress.report({ increment: 60, message: "Retrieved staged changes" });

                    const commitMessage = await generateCommitMessage(client, minifiedChanges);
                    progress.report({ increment: 80, message: "Generated commit message" });

                    setCommitMessage(repo, commitMessage);
                    progress.report({ increment: 100, message: "Set commit message" });
                }
            );
        } catch (error: unknown) {
            handleError(error, "Error logging staged changes");
        }
    });
    context.subscriptions.push(disposableLogStagedChanges);
}

// This method is called when your extension is deactivated
export function deactivate() {}
