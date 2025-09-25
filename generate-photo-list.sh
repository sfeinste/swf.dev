#!/bin/bash

# Generate JSON files with photo lists for each gallery
echo "Generating photo lists..."

# Generate astro photos list
echo '{"photos":[' > photos/astro/photos.json
first=true
for file in photos/astro/*.{jpg,jpeg,png,PNG,JPG,JPEG}; do
    if [ -f "$file" ]; then
        if [ "$first" = false ]; then
            echo "," >> photos/astro/photos.json
        fi
        filename=$(basename "$file")
        echo -n "\"$filename\"" >> photos/astro/photos.json
        first=false
    fi
done
echo ']}' >> photos/astro/photos.json

# Generate wildlife photos list
echo '{"photos":[' > photos/wildlife/photos.json
first=true
for file in photos/wildlife/*.{jpg,jpeg,png,PNG,JPG,JPEG}; do
    if [ -f "$file" ]; then
        if [ "$first" = false ]; then
            echo "," >> photos/wildlife/photos.json
        fi
        filename=$(basename "$file")
        echo -n "\"$filename\"" >> photos/wildlife/photos.json
        first=false
    fi
done
echo ']}' >> photos/wildlife/photos.json

# Generate misc photos list
echo '{"photos":[' > photos/misc/photos.json
first=true
for file in photos/misc/*.{jpg,jpeg,png,PNG,JPG,JPEG}; do
    if [ -f "$file" ]; then
        if [ "$first" = false ]; then
            echo "," >> photos/misc/photos.json
        fi
        filename=$(basename "$file")
        echo -n "\"$filename\"" >> photos/misc/photos.json
        first=false
    fi
done
echo ']}' >> photos/misc/photos.json

echo "Photo lists generated successfully!"