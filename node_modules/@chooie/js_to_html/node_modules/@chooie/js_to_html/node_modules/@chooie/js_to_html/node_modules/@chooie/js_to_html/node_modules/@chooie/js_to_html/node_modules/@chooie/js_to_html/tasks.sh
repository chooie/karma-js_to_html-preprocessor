#!/usr/bin/env bash

if [ ! -f node_modules/chromedriver/lib/chromedriver/chromedriver ]; then
   echo "Building node_modules binaries"
   npm rebuild
fi

mkdir -p generated_build

if [ ! -f generated_build/operating_system.txt ]; then
  echo "First run so no OS yet" > "generated_build/operating_system.txt"
fi

built_operating_system=`cat generated_build/operating_system.txt`
current_operating_system=`uname`

if [ "$current_operating_system" != "$built_operating_system" ]; then
  echo "$current_operating_system" > "generated_build/operating_system.txt"
  echo "New platform detected. Was ${built_operating_system}, now \
${current_operating_system}"

  echo 'Rebuilding binaries...'
  npm rebuild
fi

./node_modules/jake/bin/cli.js --jakefile src/build/Jakefile.js $@
