#!/usr/bin/env sh
# Renders the raster icons in public/ from the SVG sources next to this script. Needs ImageMagick 7.
set -eu
cd "$(dirname "$0")"
OUT=../../public
TMP=$(mktemp -d)

for size in 16 32 48; do
  magick -background none -density 1200 mark-flat.svg -resize "${size}x${size}" "$TMP/fav-$size.png"
done
magick "$TMP/fav-16.png" "$TMP/fav-32.png" "$TMP/fav-48.png" "$OUT/favicon.ico"

magick -background "#6A4DF5" -density 600 app-icon.svg -resize 180x180 -flatten "$OUT/apple-touch-icon.png"
magick -background none -density 600 app-icon-rounded.svg -resize 192x192 "$OUT/icon-192.png"
magick -background none -density 600 app-icon-rounded.svg -resize 512x512 "$OUT/icon-512.png"
magick -background "#6A4DF5" -density 600 app-icon-maskable.svg -resize 512x512 -flatten "$OUT/icon-maskable-512.png"

rm -rf "$TMP"
echo "icons written to public/"
