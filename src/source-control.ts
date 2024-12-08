import { minifyString, showInfoMessage } from "./helper";
import * as vscode from "vscode";

export function getGitAPI() {
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
export async function getStagedChanges(repo: any) {
    const stagedChanges = await repo.diff(true);
    if (stagedChanges.length === 0) {
        showInfoMessage("No staged changes found.");
        throw new Error("No staged changes found.");
    }
    return minifyString(stagedChanges);
}
