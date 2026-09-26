#!/usr/bin/env bash
# Deploys a release: clean main, HEAD tagged with the package.json version.
set -euo pipefail

version="v$(node -p 'require("./package.json").version')"

[ "$(git branch --show-current)" = main ] || { echo "Deploy from main." >&2; exit 1; }
[ -z "$(git status --porcelain)" ] || { echo "Working tree is not clean." >&2; exit 1; }
git tag --points-at HEAD | grep -qx "$version" || { echo "HEAD is not tagged $version." >&2; exit 1; }

vite build
wrangler deploy --tag "$version" --message "$version"
