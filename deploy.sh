#!/usr/bin/env bash
# deploy.sh – one-command deployment for the tour project
# 1. Pull latest code from the chosen branch
# 2. Install/upgrade production dependencies
# 3. Build the production bundle (frontend)
# 4. Restart the PM2 process that serves the site

set -euo pipefail  # exit on error, undefined var ⇒ error, pipefail

APP_DIR="$HOME/tour"              # directory on the VPS where the repo lives
BRANCH="main"                    # git branch to deploy
PM2_APP_NAME="tour-backend"      # pm2 process name (change if different)

printf '\n▶︎ Switching to %s\n' "$APP_DIR"
cd "$APP_DIR"

printf '\n▶︎ Fetching latest code from %s\n' "$BRANCH"
git fetch origin "$BRANCH"
git reset --hard "origin/$BRANCH"

printf '\n▶︎ Installing/updating dependencies (npm ci)\n'
npm ci --silent

printf '\n▶︎ Building production bundle\n'
npm run build

printf '\n▶︎ Restarting PM2 process: %s\n' "$PM2_APP_NAME"
pm2 restart "$PM2_APP_NAME" --update-env

printf '\n✅ Deployment finished at %s\n' "$(date)"
