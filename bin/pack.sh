#!/bin/bash
rm -rf tmp/package
PACKAGE="$(npm pack 2>&1 | tail -1)"
mkdir -p tmp
tar -xvzf $PACKAGE -C tmp
#mv $PACKAGE ${PACKAGE/-[0-9.]*.tgz/.tgz}
echo "$PACKAGE"