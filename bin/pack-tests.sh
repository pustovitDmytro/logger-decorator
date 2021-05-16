#!/bin/bash
set -e

echo "Packing ..."    
TAR_NAME="$(npm pack 2>&1 | tail -1)"
./bin/pack-tests.js $TAR_NAME
mv $TAR_NAME tmp/package-tests/