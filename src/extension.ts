// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import OpenAI from "openai";

// Utility function to minify a string
function minifyString(input: string): string {
    return JSON.stringify(input.replace(/\n/g, "\\n"));
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "llm-commit-craft" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    const disposable = vscode.commands.registerCommand("llm-commit-craft.helloWorld", () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage("Hello World from llm-commit-craft!");
    });

    const disposableLogStagedChanges = vscode.commands.registerCommand("llm-commit-craft.logStagedChanges", async () => {
        try {
            const client = new OpenAI({
                baseURL: "http://127.0.0.1:1234/v1/",
                apiKey: "",
            });

            const listOfModels = await client.models.list();
            console.log(listOfModels);

            const gitExtension = vscode.extensions.getExtension("vscode.git")?.exports;
            if (!gitExtension) {
                throw new Error("Git extension is not available.");
            }
            // console.log(gitExtension);

            const api = gitExtension.getAPI(1);
            if (!api) {
                throw new Error("Failed to get Git API.");
            }

            const repo = api.repositories[0];
            if (!repo) {
                throw new Error("No repository found.");
            }

            const stagedChanges = await repo.diff(true);
            if (stagedChanges.length === 0) {
                console.log("No staged changes found.");
                vscode.window.showInformationMessage("No staged changes found.");
            } else {
                const minifiedChanges = minifyString(stagedChanges);
                console.log("Staged Changes:", minifiedChanges);

                const response = await client.chat.completions.create({
                    model: "qwen2.5-coder-3b-instruct",
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
                    temperature: 0.8,
                    max_tokens: -1,
                    seed: -1,
                    stream: false,
                });
                const commitMessage = response.choices[0].message.content ?? "";
                console.log("Response:", commitMessage);

                // Set the commit message in the source control input box
                // const scm = vscode.scm;
                // Clean the current message:
                const inputBox = repo.inputBox;
                console.log(inputBox);
                // const inputBox = scm?.inputBox;
                if (inputBox) {
                    // inputBox.value = "";
                    inputBox.value = commitMessage;
                    vscode.commands.executeCommand("workbench.view.scm");
                    // vscode.window.showInformationMessage("Commit message has been set in the source control input box.");
                } else {
                    throw new Error("Source control input box value is not available.");
                }

                // vscode.commands.executeCommand("workbench.view.scm");
            }
        } catch (error: unknown) {
            const err = error as Error;
            console.error("Error logging staged changes:", err.message);
            vscode.window.showErrorMessage(`Error logging staged changes: ${err.message}`);
        }
    });

    context.subscriptions.push(disposable);
    context.subscriptions.push(disposableLogStagedChanges);
}

// This method is called when your extension is deactivated
export function deactivate() {}
