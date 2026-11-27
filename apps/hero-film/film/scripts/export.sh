#!/usr/bin/env bash
# Renders the hero film (landscape + portrait cut, per locale) and encodes lightweight web exports + posters.
#   scripts/export.sh                    # full: masters, web encodes, posters, copy to preview
#   LOCALES=de scripts/export.sh         # only the German cuts (default: "en de")
#   SKIP_RENDER=1 scripts/export.sh      # re-encode existing masters only
#   SKIP_COPY=1                          # leave preview/media untouched
# English files keep their plain names (hero-landscape.av1.mp4); German ones carry ".de"
# (hero-landscape.de.av1.mp4).
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=../out
WEB=$OUT/web
PREVIEW=../preview/media
mkdir -p "$OUT/master" "$WEB" "$PREVIEW"

LOCALES=${LOCALES:-en de}
POSTER_FRAME=${POSTER_FRAME:-2900}   # wide shot: logo + the whole loop
SHARP=$(cd ../../software && pwd)/node_modules/sharp

comp_id() { # orientation locale
  local base=$([[ $1 == landscape ]] && echo HeroLandscape || echo HeroPortrait)
  [[ $2 == en ]] && echo "$base" || echo "${base}$(echo "$2" | tr '[:lower:]' '[:upper:]')"
}
suffix() { [[ $1 == en ]] && echo "" || echo ".$1"; }

enc() { # name master width height av1crf vp9crf h264crf
  local name=$1 src=$2 w=$3 h=$4 fps=${FPS_WEB:-60}
  local vf="scale=${w}:${h}:flags=lanczos,fps=${fps},format=yuv420p"
  ffmpeg -loglevel error -y -i "$src" -an -vf "$vf" -c:v libsvtav1 -preset 4 -crf "$5" -g 240 \
    -svtav1-params tune=0:film-grain=0 -movflags +faststart "$WEB/$name.av1.mp4" 2>/dev/null
  ffmpeg -loglevel error -y -i "$src" -an -vf "$vf" -c:v libvpx-vp9 -b:v 0 -crf "$6" -row-mt 1 -deadline good -cpu-used 2 -g 240 \
    "$WEB/$name.vp9.webm"
  # H.264 is the compatibility fallback (preferred on Safari/iOS): 30 fps keeps it light.
  ffmpeg -loglevel error -y -i "$src" -an -vf "scale=${w}:${h}:flags=lanczos,fps=30,format=yuv420p" -c:v libx264 -preset slow -crf "$7" -profile:v high -g 120 \
    -movflags +faststart "$WEB/$name.h264.mp4"
}

for loc in $LOCALES; do
  sfx=$(suffix "$loc")
  for orient in landscape portrait; do
    comp=$(comp_id "$orient" "$loc")
    if [[ -z "${SKIP_RENDER:-}" ]]; then
      npx remotion render src/index.ts "$comp" "$OUT/master/$comp.mov" \
        --codec=prores --prores-profile=hq --concurrency="${CONCURRENCY:-6}" --log=error
    fi
    if [[ $orient == landscape ]]; then size=(1920 1080); else size=(1080 1350); fi
    enc "hero-$orient$sfx" "$OUT/master/$comp.mov" "${size[0]}" "${size[1]}" ${AV1_CRF:-48} ${VP9_CRF:-48} ${H264_CRF:-31}

    # Poster / reduced-motion still from the wide shot.
    png="$OUT/poster-$orient$sfx.png"
    npx remotion still src/index.ts "$comp" "$png" --frame="$POSTER_FRAME" --log=error
    cwebp -quiet -q 80 "$png" -o "$WEB/poster-$orient$sfx.webp"
    ffmpeg -loglevel error -y -i "$png" -q:v 4 "$WEB/poster-$orient$sfx.jpg"
    node -e "require('$SHARP')(process.argv[1]).avif({quality:55,effort:6}).toFile(process.argv[2])" "$png" "$WEB/poster-$orient$sfx.avif"
  done
done

[[ -n "${SKIP_COPY:-}" ]] || cp "$WEB"/* "$PREVIEW"/
ls -la "$WEB"
