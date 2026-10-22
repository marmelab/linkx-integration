#!/usr/bin/env bash
set -euo pipefail

: "${DOMAIN:?set DOMAIN to the domain whose A records point at the host EIP}"

SSH_HOST=13.39.102.221
SSH_CERTIFICATE="~/AWS/certificates/maxime.pem"
SSH_USER="ubuntu"
SSH_OPTS="-i ${SSH_CERTIFICATE} -o StrictHostKeyChecking=accept-new -o ConnectTimeout=15"

docker build --platform linux/amd64 -f packages/cli/Dockerfile -t node-linkx-integration:prod .
docker build --platform linux/amd64 -f packages/web/Dockerfile -t frankenphp_prod .

ssh $SSH_OPTS "$SSH_USER@$SSH_HOST" \
	'cloud-init status --wait >/dev/null 2>&1 || true; until docker compose version >/dev/null 2>&1; do sleep 5; done'

docker save node-linkx-integration:prod frankenphp_prod \
	| gzip | ssh $SSH_OPTS "$SSH_USER@$SSH_HOST" 'docker load'

scp $SSH_OPTS ./compose.prod.yaml infra/config/Caddyfile "$SSH_USER@$SSH_HOST:~/"

ssh $SSH_OPTS "$SSH_USER@$SSH_HOST" \
	'docker compose --env-file docker-compose.env -f compose.prod.yaml up -d --remove-orphans \
	 && docker compose --env-file docker-compose.env -f compose.prod.yaml up -d --force-recreate --no-deps caddy node-linkx \
	 && docker compose --env-file docker-compose.env -f compose.prod.yaml exec php php bin/console doctrine:migrations:migrate'

echo "Deployed. https://$DOMAIN";