#!/usr/bin/env bash

bundle install
yarn install --frozen-lockfile

CI=true yarn build
CI=true yarn test