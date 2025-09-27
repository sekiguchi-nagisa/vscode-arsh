#!/bin/sh

error() {
    echo 1>&2 $@
    exit 1
}

npm ci || error npm install failed
npm run-script compile
npm run-script build || error build failed

NAME="$(npm ls | head -n 1 | cut -d ' ' -f 1 | cut -d @ -f 1)"
VERSION="$(npm ls | head -n 1 | cut -d ' ' -f 1 | cut -d @ -f 2)"

PACKAGE="${NAME}-${VERSION}.vsix"
echo $PACKAGE
test -f "$PACKAGE" || error not found package: "$PACKAGE"

if [ "$1" != '--no-install' ] && [ "$1" != '-n' ]; then
    code --install-extension "$PACKAGE"
fi
