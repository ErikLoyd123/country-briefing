# Country Briefing: everyday tasks. Run `make` to list them.
# Needs Node 22.12 or newer (the version is pinned in .nvmrc: `nvm use` picks it up).

.DEFAULT_GOAL := help
.PHONY: help setup install check-node dev start stop restart status logs test build check preview media clean

help: ## List the tasks
	@grep -E '^[a-z-]+:.*## ' $(MAKEFILE_LIST) | awk -F':.*## ' '{printf "  make %-10s %s\n", $$1, $$2}'

setup: check-node node_modules .env ## First time: check Node, install dependencies, create .env
	@echo "Ready. Run 'make dev' and open http://localhost:4321"

install: check-node ## Reinstall dependencies exactly as locked in package-lock.json
	npm ci

check-node:
	@command -v node >/dev/null || { echo "Node.js is not installed. Get it from https://nodejs.org or with nvm: https://github.com/nvm-sh/nvm"; exit 1; }
	@node -e 'const [a, b] = process.versions.node.split(".").map(Number); if (a < 22 || (a === 22 && b < 12)) { console.error("Node " + process.versions.node + " is too old. Install Node 22.12 or newer (with nvm: nvm install && nvm use)."); process.exit(1); }'

node_modules: package-lock.json
	npm ci
	@touch node_modules

.env:
	cp .env.example .env
	@echo "Created .env. Add your Unsplash and Pexels keys before running 'make media' (see README)."

dev: node_modules ## Run the local site at http://localhost:4321 in this terminal (Ctrl+C stops it)
	npm run dev

start: node_modules ## Run the local site in the background
	npx astro dev --background

stop: ## Stop the background local site
	npx astro dev stop

restart: node_modules ## Restart the background site with a fresh content cache (after config or plugin changes)
	-npx astro dev stop
	npx astro dev --background --force

status: ## Is the local site running?
	npx astro dev status

logs: ## Follow the background site's log
	npx astro dev logs --follow

test: node_modules ## Run the unit tests (source tables, citations)
	npm test

build: node_modules ## Build the static site into dist/ (fails on bad content or unknown claim IDs)
	npm run build

check: node_modules ## Tests, then a full build: run before you push
	npm run check

preview: build ## Serve the built site from dist/
	npm run preview

media: node_modules .env ## Download the photos and videos listed in media-sources.yaml
	npm run media

clean: ## Delete build output and caches
	rm -rf dist .astro node_modules/.vite
