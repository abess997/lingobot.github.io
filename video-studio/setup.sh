#!/usr/bin/env bash
# One-command setup for the Video Studio workspace.
set -euo pipefail
cd "$(dirname "$0")"

echo "==> Fetching OpenMontage (submodule)..."
git submodule update --init --recursive OpenMontage

for cmd in python3 node npm ffmpeg; do
  command -v "$cmd" >/dev/null 2>&1 || { echo "ERROR: '$cmd' is not installed."; exit 1; }
done

echo "==> Installing OpenMontage (make setup)..."
make -C OpenMontage setup

echo "==> Linking brand style into OpenMontage/styles/custom ..."
mkdir -p OpenMontage/styles/custom
ln -sf "$(pwd)/01-brand/my-brand.style.yaml" OpenMontage/styles/custom/my-brand.yaml

echo "==> Checking available tools (preflight summary)..."
OpenMontage/.venv/bin/python - <<'PY' || true
import os, sys
os.chdir("OpenMontage"); sys.path.insert(0, ".")
from tools.tool_registry import registry
registry.discover()
for k, v in registry.provider_menu().items():
    if isinstance(v, dict) and "available" in v:
        print(f"  {k:24s} {len(v['available'])}/{v.get('total')}")
PY

cat <<'EOF'

Done.
 - Add API keys (optional): OpenMontage/.env   (see 05-workflow/api-keys-guide.md)
 - Zero-key test render:   make -C OpenMontage demo
 - Start working:          claude   (from inside video-studio/)
EOF
