#!/usr/bin/env bash
set -euo pipefail
DE_TOOLS="$(cd "$(dirname "$0")" && pwd)"
DE_ROOT="$(cd "$DE_TOOLS/../../.." && pwd)"
DE_NODE_VERSION="$(cat "$DE_ROOT/software/.nvmrc")"
export PATH="$HOME/.nvm/versions/node/v$DE_NODE_VERSION/bin:$PATH"
cd "$DE_ROOT"
case "${1:-start}" in
 start|restart|stop|seed) node "$DE_TOOLS/manage.mjs" "${1:-start}" ;;
 capture) shift; node "$DE_TOOLS/stills.mjs" "$@" ;;
 sequences) node "$DE_TOOLS/prepare-start.mjs" --flow-only; node "$DE_TOOLS/sequences.mjs" --only seq-start ;;
 flow) node "$DE_TOOLS/round2-flow.mjs" ;;
 maintenance) node "$DE_TOOLS/maintenance.mjs" ;;
 verify) node "$DE_TOOLS/verify.mjs" ;;
 recapture) node "$DE_TOOLS/recapture.mjs" ;;
 *) echo 'Usage: de/run.sh start|restart|stop|seed|capture|sequences|flow|maintenance|verify|recapture'; exit 1 ;;
esac
