import * as vscode from "vscode";

// Utility function to minify a string
export function minifyString(input: string): string {
    return JSON.stringify(input.replace(/\n/g, "\\n"));
}

// Utility function to display information messages
export function showInfoMessage(message: string) {
    vscode.window.showInformationMessage(message);
}
