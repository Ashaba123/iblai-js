# Changesets

This folder contains changeset files that describe changes to be released.

## How to create a changeset

Run `pnpm changeset` and follow the prompts.

The changeset file will describe:
- Which packages are affected
- What type of change it is (major, minor, or patch)
- A summary of the change

## How changesets work

1. **Create**: Contributors create changeset files when they make changes
2. **Version**: Maintainers run `pnpm changeset:version` to bump versions
3. **Publish**: Maintainers run `pnpm changeset:publish` to publish to npm

The GitHub Action will also create a "Version Packages" PR automatically when changesets are merged to main.
