#!/bin/bash
set -e

echo "Packing ..."    
TAR_NAME="$(npm pack 2>&1 | tail -1)"
./bin/pack-tests.js $TAR_NAME

echo "Testing ..."    
cd ./tmp/package-tests
npm i
npm test