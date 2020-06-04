# 2. Cache Auth0 User Data

Date: 2020-06-03

## Status

Accepted

## Context

We noticed that Auth0 user data in the backend is being used more frequently and making API call to Auth0 is not 
efficient and increases response time for the backend api. We needed to implement simple caching mechanism 
to store user data and only hit the Auth0 in case of a cache miss.

## Decision

Implement in-memory NodeJS cache using [node-cache](https://www.npmjs.com/package/node-cache)

## Consequences

Caching will be implemented in the server-side code. Auth0 user data will be cached in memory
resulting in faster response time. The user data cache is deleted periodically as set per TTL set.
When a new user is created in Auth0, DELETE API for user cache is called and the user cache is flushed.
