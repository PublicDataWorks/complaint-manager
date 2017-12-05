#!/usr/bin/env bash

bundle install
yarn

yarn build
yarn test