# Contributing

Thanks for taking the time. This page is the short version of how to send a change.

## Before you start

- For a bug, search the [open issues](../../issues) first. If it's new, open one with the steps to reproduce.
- For a feature or a larger change, open an issue and wait for a reply before writing code. It saves you a rejected pull request.
- Small fixes (a typo, a broken link) can go straight to a pull request.

## Set up

```sh
git clone https://github.com/YOUR_ORG/YOUR_REPO.git
cd YOUR_REPO
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

## AI tools

You may use AI tools to contribute. Say so in the pull request description when a tool wrote a significant part of your change. You're responsible for what you send: run it, and be ready to explain every line in your own words. The full text this section comes from is in [a policy you can copy](https://openresource.dev/guide/ai/contribution-policy/).

## Questions

Ask in [Discussions](../../discussions), not in issues.

## Code of conduct

Everyone taking part follows the [code of conduct](CODE_OF_CONDUCT.md).
