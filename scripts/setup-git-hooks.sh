#!/usr/bin/env bash

## Install git pre-push hook to your local .git directory
cd `dirname $0`
find ../.git/hooks -type f -not -name '*.sample' | xargs rm
ln -f -v ./git-hooks/* ../.git/hooks/
echo "Setting up git-hooks.... done"