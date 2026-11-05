# linkx-integration

A command-line implementation of the board game **Linkx**, played in the terminal.

Official rules: <https://www.jeux-abstraits.fr/wp-content/uploads/2026/07/lynkx.pdf> · publisher page: <https://blueorangegames.eu/fr/jeux/linkx/>

## Getting started

You need a working **docker** and **docker-compose**.
You will also need **npm** for the mobile version.

```bash
make dev
```

Web version: http://localhost
Api: http://localhost:3005
Swagger: http://localhost:3080
Admin: http://localhost:5173

After using make install or modifying the node files, you need to rebuild:

```bash
docker-compose build && docker-compose up
```

### With real time

Execute the following commands from the project root

```bash
cd packages/web/config/jwt/mercure
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:4096 -out publisher.key
openssl pkey -in publisher.key -pubout -out publisher.key.pub
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:4096 -out subscriber.key
openssl pkey -in subscriber.key -pubout -out subscriber.key.pub
cd ../../../../..
`̀``

### On native mobile

You need android studio with a working emulator, or a device connected through adb.
[Expo documentation](https://docs.expo.dev/workflow/android-studio-emulator/)

Dev mode :

```bash
make mobile
```

Add to your `.env.local` `EXPO_PUBLIC_API_URL=http://<your LOCAL ip here>/api`.
Example: `EXPO_PUBLIC_API_URL=http://192.168.1.XXX/api`

### Using cli mode

You need **Node v26** (see `.nvmrc`) and **pnpm 12**. Or open the repository in the devcontainer, which ships with both.

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
- pnpm workspace: each package lives in `packages/`. Only the cli package is handled by pnpm. Others are handled through composer (web) or npm.
- PHP for the public API, with Symfony. Twig is used for the Web package.
- React-native w/ expo for the mobile package.
- Shadcn-admin-kit for the admin package.
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

**Make sure you are on main before deploying!**

### Web only (without android app)

By default, android is not included because the deploy time goes from under a minute to 10-30min when building the android version.

```bash
DOMAIN=linkx-integration.marmelab.com make deploy
```

### With android (full deployment)

This command takes 10-30min to complete, as it will start a gradle build for the android app on top of the APIs.

```bash
DOMAIN=linkx-integration.marmelab.com BUILD_MODE=FULL make deploy
```
