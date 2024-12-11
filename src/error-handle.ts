import * as vscode from "vscode";

export function handleError(error: unknown, message: string) {
    const error_ = error as Error;
    console.error(message, error_.message);
    vscode.window.showErrorMessage(`${message}: ${error_.message}`);
}
