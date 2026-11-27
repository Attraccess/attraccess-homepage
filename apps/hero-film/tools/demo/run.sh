#!/usr/bin/env bash
set -euo pipefail
DEMO_TOOLS="$(cd "$(dirname "$0")" && pwd)"
DEMO_ROOT="$(cd "$DEMO_TOOLS/../.." && pwd)"
DEMO_NODE_VERSION="$(cat "$DEMO_ROOT/software/.nvmrc")"
export PATH="$HOME/.nvm/versions/node/v$DEMO_NODE_VERSION/bin:$PATH"
cd "$DEMO_ROOT"
case "${1:-start}" in
 start) node "$DEMO_TOOLS/manage.mjs" start ;;
 restart) node "$DEMO_TOOLS/manage.mjs" restart ;;
 seed) node "$DEMO_TOOLS/manage.mjs" seed ;;
 capture) shift; node "$DEMO_TOOLS/capture.mjs" "$@"; if [ "$#" -eq 0 ]; then node "$DEMO_TOOLS/sequences.mjs"; fi; node "$DEMO_TOOLS/verify.mjs" ;;
 sequences) shift; node "$DEMO_TOOLS/sequences.mjs" "$@"; node "$DEMO_TOOLS/verify.mjs" ;;
 verify) node "$DEMO_TOOLS/verify.mjs" ;;
 stop) node "$DEMO_TOOLS/manage.mjs" stop ;;
 *) printf '%s\n' 'Usage: run.sh start|restart|seed|capture [--only shot,...]|sequences [--only seq-timer,...]|verify|stop'; exit 1 ;;
esac
