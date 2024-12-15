# Change Log

All notable changes to the "llm-commit-craft" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [0.1.0](https://github.com/myinusa/llm-commit-craft/compare/v0.0.1...v0.1.0) (2024-12-15)


### Features

* add new API interface for managing Git repositories and remote sources (`src/api/git.d.ts` and `src/source-control.ts`) ([34a5809](https://github.com/myinusa/llm-commit-craft/commit/34a5809cf05267d54ce0e9d15f8f96f39ec5198a))
* **extension:** refactor initialization to allow selecting repository ([778afe3](https://github.com/myinusa/llm-commit-craft/commit/778afe358a53f0662d67ad74396b528e7cbb567c))
* **src/api/vscode.git.enums.ts:** Add new Git enums for force push modes and ref types ([86e957a](https://github.com/myinusa/llm-commit-craft/commit/86e957af98b4e476766d7e87dd5b78456714e50d))
* **src/commit-message.ts:** Add OpenAI and Repository imports and update generateCommitMessage and setCommitMessage functions ([bc5cc9c](https://github.com/myinusa/llm-commit-craft/commit/bc5cc9c7acf7e95dca10520b7133b1e22d78e120))
* **src/settings.json:** Update TypeScript settings to include ESLint configurations ([22aca42](https://github.com/myinusa/llm-commit-craft/commit/22aca422ea15b9fb37bc18629bbdb45a1d289018))


### Bug Fixes

* **extension.ts:** Improve the logStagedChanges function by using withProgress for better user experience, add error handling, and improve logging messages ([bc5cc9c](https://github.com/myinusa/llm-commit-craft/commit/bc5cc9c7acf7e95dca10520b7133b1e22d78e120))
* **README.md:** Update roadmap with new features ([86e957a](https://github.com/myinusa/llm-commit-craft/commit/86e957af98b4e476766d7e87dd5b78456714e50d))
* **source-control.ts:** handle the case when no staged changes are found by returning undefined ([778afe3](https://github.com/myinusa/llm-commit-craft/commit/778afe358a53f0662d67ad74396b528e7cbb567c))
* **src/commit-message.ts:** Refactor setCommitMessage function to remove unnecessary parameters ([22aca42](https://github.com/myinusa/llm-commit-craft/commit/22aca422ea15b9fb37bc18629bbdb45a1d289018))
* **src/error-handle.ts:** Fix error handling in handleError function to display correct message ([22aca42](https://github.com/myinusa/llm-commit-craft/commit/22aca422ea15b9fb37bc18629bbdb45a1d289018))

## 0.0.1 (2024-12-08)


### Features

* **commit-message:** implement commit message generation functionality ([dd2a70a](https://github.com/myinusa/llm-commit-craft/commit/dd2a70a85fb19aad5616f0c9a135a5af7a2b30bf))
* **constants:** define constants for LLM configuration ([dd2a70a](https://github.com/myinusa/llm-commit-craft/commit/dd2a70a85fb19aad5616f0c9a135a5af7a2b30bf))
* **error-handle:** create error handling utility ([dd2a70a](https://github.com/myinusa/llm-commit-craft/commit/dd2a70a85fb19aad5616f0c9a135a5af7a2b30bf))
* release please ([dd57812](https://github.com/myinusa/llm-commit-craft/commit/dd578124b6fa34e2eee176d4bc1e04036727fa0b))
* **vscode:** add peacock color setting and typescript SDK path ([dd2a70a](https://github.com/myinusa/llm-commit-craft/commit/dd2a70a85fb19aad5616f0c9a135a5af7a2b30bf))


### Bug Fixes

* **source-control:** improve staged changes retrieval logic ([dd2a70a](https://github.com/myinusa/llm-commit-craft/commit/dd2a70a85fb19aad5616f0c9a135a5af7a2b30bf))


### Miscellaneous Chores

* release 0.0.1 ([b5cf4ae](https://github.com/myinusa/llm-commit-craft/commit/b5cf4ae4780069cc3b6bcfad35686ca87d2350be))

## [Unreleased]

- Initial release
