#!/usr/bin/env bash

bundle install
npm install

npm run build
npm test