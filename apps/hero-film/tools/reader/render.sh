#!/usr/bin/env bash
set -euo pipefail
workspace="$(cd "$(dirname "$0")/../.." && pwd)"
reader_build="${READER_BUILD_DIR:-/tmp/attraccess-hero-reader-build}"
cmake -S "$workspace/tools/reader" -B "$reader_build" -DCMAKE_BUILD_TYPE=Debug
cmake --build "$reader_build" --target reader-film-host display-theme-host resource-introducers-parser --parallel 6
ctest --test-dir "$reader_build/production-harness" --output-on-failure
for locale in en de; do
  "$reader_build/reader-film-host" "$reader_build/raw/$locale" "$locale"
  "$reader_build/reader-film-host" "$reader_build/repeat/$locale" "$locale"
  for original in "$reader_build/raw/$locale/"*.rgba; do
    cmp "$original" "$reader_build/repeat/$locale/$(basename "$original")"
  done
done
node "$workspace/tools/reader/export.cjs" "$reader_build/raw"
