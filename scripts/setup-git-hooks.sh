#!/usr/bin/env bash

## Install git pre-push hook to your local .git directory
cd `dirname $0`
ln -f ./git-hooks/pre-push ../.git/hooks/pre-push
ln -f ./git-hooks/pre-commit ../.git/hooks/pre-commit
echo "Setting up git-hooks.... done"