import { API, GitExtension, Repository } from "./api/git";
import { minifyString } from "./helper";
import * as vscode from "vscode";

export function getGitAPI(): API {
    const gitExtension = vscode.extensions.getExtension("vscode.git")?.exports as GitExtension | undefined;
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
export async function getStagedChanges(repo: Repository) {
    const stagedChanges = await repo.diff(true);
    if (stagedChanges.length === 0) {
        // showInfoMessage("No staged changes found.");
        throw new Error("No staged changes found.");
    }
    return minifyString(stagedChanges);
}

export async function checkForStagedChanges(repositories: Repository[]): Promise<Repository | undefined> {
    for (const repo of repositories) {
        const stagedChanges = await getStagedChanges(repo);
        if (stagedChanges.length > 0) {
            return repo;
        }
    }
    return undefined;
    // showWarningMessage("No staged changes found.");
}