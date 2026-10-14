default: help

help:									## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(firstword $(MAKEFILE_LIST)) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

install:
	@pnpm install

lint: generate
	@pnpm lint:apply
	@pnpm fmt:apply

STAGED = git --no-pager diff --cached --name-only --diff-filter=ACMR

lint-staged:
	@($(STAGED) | grep -E '\.(ts|tsx)$$' | xargs -r pnpm oxlint --fix)
	@($(STAGED) | grep -E '\.(js|json|ts|tsx|md)$$' | xargs -r pnpm oxfmt)

test:
	@pnpm test

test-watch:
	@pnpm test:watch

run:
	@pnpm --filter @linkx-integration/cli run run:cli --file=$(file)

dev:
	@docker compose up -d

stop:
	@docker compose down

deploy:	## Deploy over SSH (requires DOMAIN=...)
	@DOMAIN=$(DOMAIN) ./infra/scripts/deploy.sh