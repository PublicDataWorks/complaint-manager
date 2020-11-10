# 5. Http to Https Redirect

Date: 2020-11-09

## Status

Proposed

## Context
Given that we want to start supporting publicly accessible pages, we would need a way to redirect to https for unauthenticated sessions.
Since we don't have a reverse proxy sitting in front of our heroku application, we need a way to solve for https redirection within the application.


## Decision
Upon researching the various https redirection libraries for express, we have came to the conclusion that [express-sslify](https://github.com/florianheinemann/express-sslify) is the most [downloaded](https://www.npmtrends.com/express-sslify-vs-express-force-ssl-vs-heroku-ssl-redirect-vs-express-enforces-ssl-vs-express-https-redirect) and this package does not only support for the heroku platform and therefore could be valuable to us down the road.
 

## Consequences
We have disabled the express-sslify on development and test enviroments due to failing server tests otherwise.