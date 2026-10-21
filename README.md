# linkx-integration

A command-line implementation of the board game **Linkx**, played in the terminal.

Official rules: <https://www.jeux-abstraits.fr/wp-content/uploads/2026/07/lynkx.pdf> · publisher page: <https://blueorangegames.eu/fr/jeux/linkx/>

## Getting started

You need a working **docker** and **docker-compose**.
You will also need **npm** for the mobile version.

```bash
make dev
```

Web version: https://localhost/game
Api: http://localhost:3005
Swagger: http://localhost:3080

After modifying the node files, you need to rebuild:

```bash
docker-compose build && docker-compose up
```

## On native mobile

You need android studio with a working emulator.
[Expo documentation](https://docs.expo.dev/workflow/android-studio-emulator/)

```bash
make mobile
```

## Using cli mode

You need Node v26 (see `.nvmrc`) and pnpm 12. Or open the repository in the devcontainer, which ships with both.

```bash
make install
make run
```

Without make, use pnpm directly:

```bash
pnpm install
pnpm run --filter @linkx-integration/cli run
```

To add a dependency to the CLI (`-D` for a dev dependency):

```bash
pnpm add --filter @linkx-integration/cli picocolors
```

pnpm records the version in the `catalog` of `pnpm-workspace.yaml` and writes `catalog:` in the package's `package.json`.

| Command           | Runs                          | Purpose                                 |
| ----------------- | ----------------------------- | --------------------------------------- |
| `make install`    | `pnpm install`                | install dependencies                    |
| `make run`        | `node src/main.ts` in the CLI | start the game                          |
| `make test`       | `vitest run`                  | run the whole test suite once           |
| `make test-watch` | `vitest`                      | run tests in watch mode                 |
| `make lint`       | `oxlint --fix` then `oxfmt`   | fix lint and formatting across the repo |

A husky pre-commit hook runs `make lint-staged`, which lints and formats only the staged files.

## Stack

- TypeScript, run directly by Node: no build step.
- pnpm workspace: each package lives in `packages/`.
- Vitest for tests, oxlint (type-aware) for linting, oxfmt for formatting.
- Dependency versions are pinned once in the `catalog` of `pnpm-workspace.yaml`; packages reference them as `catalog:`. pnpm refuses releases younger than three days.

## Project layout

```text
packages/cli/src/     game source, entry point is main.ts
packages/cli/test/    shared Vitest setup
.devcontainer/        development container
```

## Tests

Tests live next to their module as `*.spec.ts`. Vitest globals (`describe`, `it`, `expect`, `vi`) are available without import, and mocks are restored after each test.

Before pushing:

```bash
make lint
make test
```

## Deploying

**Make sure you are on main before deploying**

```bash
DOMAIN=linkx-integration.marmelab.com make deploy
```
