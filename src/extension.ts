import * as vscode from "vscode";
import OpenAI from "openai";

// Constants
const OPENAI_BASE_URL = "http://127.0.0.1:1234/v1/";
const OPENAI_MODEL = "qwen2.5-coder-3b-instruct";
const OPENAI_TEMPERATURE = 0.8;
const OPENAI_MAX_TOKENS = -1;
const OPENAI_SEED = -1;

// Utility function to minify a string
function minifyString(input: string): string {
    return JSON.stringify(input.replace(/\n/g, "\\n"));
}

// Utility function to handle errors
function handleError(error: unknown, message: string) {
    const err = error as Error;
    console.error(message, err.message);
    vscode.window.showErrorMessage(`${message}: ${err.message}`);
}

// Utility function to display information messages
function showInfoMessage(message: string) {
    vscode.window.showInformationMessage(message);
}

// Function to get the Git API
function getGitAPI() {
    const gitExtension = vscode.extensions.getExtension("vscode.git")?.exports;
    if (!gitExtension) {
        throw new Error("Git extension is not available.");
    }
    const api = gitExtension.getAPI(1);
    if (!api) {
        throw new Error("Failed to get Git API.");
    }
    return api;
}

// Function to get staged changes
async function getStagedChanges(repo: any) {
    const stagedChanges = await repo.diff(true);
    if (stagedChanges.length === 0) {
        showInfoMessage("No staged changes found.");
        throw new Error("No staged changes found.");
    }
    return minifyString(stagedChanges);
}

// Function to generate commit message using OpenAI
async function generateCommitMessage(client: any, minifiedChanges: string) {
    const response = await client.chat.completions.create({
        model: OPENAI_MODEL,
        messages: [
            {
                role: "system",
                content:
                    "Create conventional commit messages from the following output of 'git diff --staged' command, use Markdown syntax as your answer no title, no heading, list or numbered list, each line a conventional commit message. It is important to include the scope. Follow the format: <type>(<scope>): <description>. The <type> could be feat, fix, docs, style, refactor, perf, test, or chore, and the <scope> would be a specific part of the codebase affected by the changes.",
            },
            {
                role: "user",
                content: `${minifiedChanges}`,
            },
        ],
        temperature: OPENAI_TEMPERATURE,
        max_tokens: OPENAI_MAX_TOKENS,
        seed: OPENAI_SEED,
        stream: false,
    });
    return response.choices[0].message.content ?? "";
}

// Function to set commit message in the source control input box
function setCommitMessage(repo: any, commitMessage: string) {
    const inputBox = repo.inputBox;
    if (inputBox) {
        inputBox.value = commitMessage;
        vscode.commands.executeCommand("workbench.view.scm");
    } else {
        throw new Error("Source control input box value is not available.");
    }
}

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "llm-commit-craft" is now active!');

    const disposable = vscode.commands.registerCommand("llm-commit-craft.helloWorld", () => {
        showInfoMessage("Hello World from llm-commit-craft!");
    });

    const disposableLogStagedChanges = vscode.commands.registerCommand("llm-commit-craft.logStagedChanges", async () => {
        try {
            const client = new OpenAI({
                baseURL: OPENAI_BASE_URL,
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

    context.subscriptions.push(disposable);
    context.subscriptions.push(disposableLogStagedChanges);
}

// This method is called when your extension is deactivated
export function deactivate() {}
