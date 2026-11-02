default: help

help:									## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(firstword $(MAKEFILE_LIST)) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

install:
	@pnpm install && cd packages/web/ && composer install && php bin/console lexik:jwt:generate-keypair --skip-if-exists && cd ../mobile && pnpm expo install && cd ../admin && npm install

lint: generate
	@pnpm lint:apply
	@pnpm fmt:apply

STAGED = git --no-pager diff --cached --name-only --diff-filter=ACMR

lint-staged:
	@($(STAGED) | grep -E '\.(ts|tsx)$$' | xargs -r pnpm oxlint --fix)
	@($(STAGED) | grep -E '\.(js|json|ts|tsx|md)$$' | xargs -r pnpm oxfmt)

test:
	@pnpm test && cd packages/web/ && php vendor/bin/phpunit  

test-watch:
	@pnpm test:watch

run:
	@pnpm --filter @linkx-integration/cli run run:cli --file=$(file)

dev:
	@make install && docker compose up -d && cd packages/admin && npm run dev

mobile:
	@cd packages/mobile && pnpm expo run:android

stop:
	@docker compose down

build:
	@docker compose build && cd packages/admin && npm run build

build-admin-prod:
	@cd packages/admin && npm run build-prod

android:
	@cd packages/mobile && pnpm --filter @linkx-integration/mobile run build:android:dev

make-migration: # Requires make dev
	@docker compose exec php php bin/console make:migration

migrate:
	@docker compose exec php php bin/console d:m:m --no-interaction

deploy:	## Deploy over SSH (requires DOMAIN=...)
	@DOMAIN=$(DOMAIN) ./infra/scripts/deploy.sh