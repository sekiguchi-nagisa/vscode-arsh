#!/bin/sh

error() {
    echo 1>&2 $@
    exit 1
}

npm run-script build || error build failed

NAME="$(npm ls | head -n 1 | cut -d ' ' -f 1 | cut -d @ -f 1)"
VERSION="$(npm ls | head -n 1 | cut -d ' ' -f 1 | cut -d @ -f 2)"

PACKAGE="${NAME}-${VERSION}.vsix"
echo $PACKAGE
test -f "$PACKAGE" || error not found package: "$PACKAGE"

code --install-extension "$PACKAGE"
