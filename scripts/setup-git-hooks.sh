#!/usr/bin/env bash

## Install git pre-push hook to your local .git directory
cd `dirname $0`
ln -fs ./git-hooks/pre-push ../.git/hooks/pre-push