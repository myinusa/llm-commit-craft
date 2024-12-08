import * as vscode from "vscode";

export function handleError(error: unknown, message: string) {
    const err = error as Error;
    console.error(message, err.message);
    vscode.window.showErrorMessage(`${message}: ${err.message}`);
}
