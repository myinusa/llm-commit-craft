import * as vscode from "vscode";
import OpenAI from "openai";
import { getGitAPI, getStagedChanges } from "./source-control";
import { generateCommitMessage, setCommitMessage } from "./commit-message";
import { handleError } from "./error-handle";
import { getClientConfig } from "./config";

export function activate(context: vscode.ExtensionContext) {
    const disposableLogStagedChanges = vscode.commands.registerCommand("llm-commit-craft.generateCommitMessage", async () => {
        try {
            await vscode.window.withProgress(
                {
                    location: vscode.ProgressLocation.Notification,
                    title: "Logging Staged Changes",
                    cancellable: false,
                },
                async (progress) => {
                    progress.report({ increment: 0 });

                    progress.report({ increment: 10, message: "Fetching repositories" });

                    const api = getGitAPI();
                    const repositories = api.repositories;
                    if (repositories.length === 0) {
                        throw new Error("No repository found.");
                    }

                    // await checkForStagedChanges(repositories);

                    let repo;
                    if (repositories.length === 1) {
                        repo = repositories[0];
                    } else {
                        const repoNames = repositories.map((r, index) => `${index + 1}. ${r.rootUri.path.split("/").pop()}`);
                        const selectedRepoName = await vscode.window.showQuickPick(repoNames, {
                            placeHolder: "Select a repository",
                        });
                        if (!selectedRepoName) {
                            throw new Error("No repository selected.");
                        }
                        const selectedIndex = Number.parseInt(selectedRepoName.split(".")[0], 10) - 1;
                        repo = repositories[selectedIndex];
                    }

                    progress.report({ increment: 20, message: "Fetched repository" });

                    const config = getClientConfig();

                    const client = new OpenAI({
                        baseURL: config.url,
                        apiKey: "",
                    });

                    progress.report({
                        increment: 40,
                        message: "Initialized OpenAI client",
                    });

                    const minifiedChanges = await getStagedChanges(repo);
                    progress.report({
                        increment: 60,
                        message: "Retrieved staged changes",
                    });

                    const commitMessage = await generateCommitMessage(client, minifiedChanges);
                    progress.report({
                        increment: 80,
                        message: "Generated commit message",
                    });

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
