# Contributing

Thanks for taking the time. This page is the short version of how to send a change.

## Before you start

- For a bug, search the [open issues](../../issues) first. If it's new, open one with the steps to reproduce.
- For a feature or a larger change, open an issue and wait for a reply before writing code. It saves you a rejected pull request.
- Small fixes (a typo, a broken link) can go straight to a pull request.

## Set up

```sh
git clone https://github.com/OWNER/REPO.git
cd REPO
# install the dependencies
# run the tests
```

## Send a pull request

1. Fork the repository and create a branch from `main`.
2. Make the change. Add or update a test when behavior changes.
3. Run the tests and the linter locally.
4. Open the pull request and fill in the template.

We squash-merge, so the pull request title becomes the commit message. Write it like `fix(parser): handle empty input`.

## Review

A maintainer replies within a week. If nothing has happened after that, comment on the pull request once.

## Questions

Ask in [Discussions](../../discussions), not in issues.

## Code of conduct

Everyone taking part follows the [code of conduct](CODE_OF_CONDUCT.md).
