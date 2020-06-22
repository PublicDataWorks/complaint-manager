# 5. Automate Environment Provisioning

Date: 2020-06-15

## Status

Accepted

## Context

Currently all of our environments are created manually. While we have the need to introduce a new env for quick testing/prototyping, we can automate this process.

## Decision

We will use Terraform for provisioning our new Playground environment. Terraform is one of the leading tools for Infrastructure as Code. Also, since we have a multi-cloud architecture (Heroku, AWS, Auth0) we need a tool that supports many providers. 

## Consequences

We created scripts to spin up the Playground environment. There are still some manual steps which will be documented in our Wiki but this is a huge improvement over how envs have been created in the past. Moreover, this moves us closer to being able to deploy completely in AWS (open source / multi-city setup).