import * as vscode from "vscode";

// Utility function to minify a string
export function minifyString(input: string): string {
    return JSON.stringify(input.replaceAll('\n', String.raw`\n`));
}

export function showInfoMessage(message: string) {
    vscode.window.showInformationMessage(message);
}

export function showErrorMessage(message: string) {
    vscode.window.showErrorMessage(message);
}

export function showWarningMessage(message: string) {
    vscode.window.showWarningMessage(message);
}
