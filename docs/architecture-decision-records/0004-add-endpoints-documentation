---
layout: default
title: ADR 004 - Choose how to document the API endpoints
parent: Architecture Decision Records
permalink: adrs/adr-004
---

# 004 - Choose how to document the API endpoints

### Date

03/18/2024

### Status

Proposed
{: .label .label-yellow }

### Context

We want to have a better way to look the API endpoints we have including the request headers, body, the response, etc.

#### Purpose

Documenting the API endpoints

#### Goal

Decide which tool is better suited for documenting the API endpoints.

### Decision

Tool we are going to use to document the API endpoints:

- [ ] Swagger
- [ ] Github

#### Swagger

For the Swagger option, Swagger is a powerful tool that allows to document the API in a way that is easy to understand and use. Also, Swagger is commonly used in the industry.
Other points considered include:

- [OpenAPI and Swagger](https://swagger.io/solutions/getting-started-with-oas/)
- It uses YAML. Learning YAML is a good skill to have because it is used in many other tools
- It has a good amount of documentation and examples available online
- There seem to be API testing capabilities that can be added to the project

An example of what a implementation would look like was implemented in the Complaint Manager(proof of concept). Here is the link to visualize it deployed:

https://noipm-ci.herokuapp.com/api-docs/
https://noipm-ci.herokuapp.com/api-docs.json

Also, make sure to take a look at the files related to them and the implementation in the code:

[Swagger configuration file](https://github.com/PublicDataWorks/complaint-manager/blob/master/src/server/swagger.js)

[server.js](https://github.com/PublicDataWorks/complaint-manager/blob/master/src/server/server.js#L53)

[retrieveCaseNotes.js api documentation example](https://github.com/PublicDataWorks/complaint-manager/blob/master/src/server/handlers/cases/caseNotes/retrieveCaseNotes.js#L13)

#### Github

For the Github alternative, it is a good tool to use if we want to keep everything in the same place. It is also a good tool to use if we want to keep the documentation in the same place as the code.

This is an example of what it would look like:

https://github.com/primeroIMS/primero/tree/main/doc/api

### Consequences

#### Swagger

- We have extra packages added to the project and they will need maintenance
- The team will need to learn how to write in YAML
- The team will need to write down the documentation for each endpoint (or/and use some ai assistant tool to help with that)

#### Github

- The team will have to write the documentation using markdown
- The team will have to write down the documentation for each endpoint (or/and use some ai assistant tool to help with that)
- There are no extra automated tests we can implement
