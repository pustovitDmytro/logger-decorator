#!/bin/bash
set -e

echo "Packing ..."
./bin/pack-tests.sh

echo "Install ..."    
cd ./tmp/package-tests
npm i --no-audit

echo "Test ..."    
npm test