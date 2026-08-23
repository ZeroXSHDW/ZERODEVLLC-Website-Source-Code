# Contributing — ZeroDev LLC Website

## Before changing code

Read the repository README and inspect the current branch before editing. Keep changes focused, preserve user work, and do not commit secrets, generated output, host-specific paths, credentials, device identifiers, or unrelated formatting churn.

Use the exact Node.js version in `.node-version` (currently Node.js 22.23.1)
before installing dependencies or running the quality gate. A version manager
such as `mise`, `nvm`, or `asdf` can load the file automatically.

## Verification

Run the strongest documented local gate before requesting review:

- run the repository's documented test, lint, type-check, build, audit, or shell-validation commands;
- keep the Jest global coverage floors at 20% statements, 15% branches, 20% functions, and 20% lines;
- run `git diff --check`;
- add or update a regression test for every repaired contract or failure path;
- confirm documentation, examples, links, and configuration match the implementation.

If an external service, device, GPU, cloud credential, or CI account limit prevents a check, record the exact blocker in the pull request and complete every safe local equivalent. Do not weaken a check, hide a warning, or add an unjustified skip to obtain a pass.

## Pull requests

Explain the problem, root cause, files changed, verification performed, security or compatibility impact, and remaining limitations. Keep the pull request independently reviewable. A maintainer reviews and merges approved changes.
