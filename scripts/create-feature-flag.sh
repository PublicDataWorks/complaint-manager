#!/bin/bash

FILENAME="$(date +'%Y%m%d%H%M')0-seed-$1-feature.js"

sed "s/manuallyAddInmateFeature/$1/" src/server/seeders/2023030900000-seed-manuallyAddInmate-feature.js > "src/server/seeders/$FILENAME"
sed -i '' "s/shows[[:space:]]a[[:space:]]\"Manually[[:space:]]Enter[[:space:]]Person[[:space:]]in[[:space:]]Custody\"[[:space:]]button[[:space:]]on[[:space:]]search[[:space:]]page/$2/" "src/server/seeders/$FILENAME"
code "src/server/seeders/$FILENAME"