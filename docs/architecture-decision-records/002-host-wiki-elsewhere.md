---
layout: default
title: ADR 002 - Host our wiki somewhere other than Google Sites
parent: Architecture Decision Records
permalink: /adrs/adr-002
---

# 002 - Host our wiki somewhere other than Google Sites

### Date

03/05/2024

### Status

Accepted
{: .label .label-green }

### Context

[Issue #499](https://github.com/PublicDataWorks/complaint-manager/issues/499) – Migrate Wiki from Google

- Our existing wiki is currently hosted on Google Sites. We want to migrate this to another platform to provide more structure and transparency for our product, as we eventually want it to become a digital public good.
- An [architectural decision matrix (ADM)](https://docs.google.com/spreadsheets/d/1CnENYvGxAxI-C9YUOJot7cYBVaAnOW06jlZBjD66tOQ/edit#gid=0) was created comparing the following options:
  - Google Sites, where our wiki is currently hosted
  - GitHub Wiki
  - Confluence
  - DokuWiki
  - Wiki.js
  - Read The Docs
  - GitHub Pages (Jekyll)

### Decision

- We have decided to move forward with GitHub Pages. This does have drawbacks, particularly the following:
  - With GitHub, pages can only be edited using markdown, which is not ideal, especially for non-technical users.
  - There is no option to have both public and private wiki pages.
- We chose GitHub Pages over the other options for the following reasons:

  | Option        | Rationale Against |
  | ------------- | ----------------- |
  | GitHub Wiki   | Aesthetics / lack of customization |
  | Confluence    | Cost              |
  | DokuWiki      | Aesthetics        |
  | Wiki.js       | This initially seemed to be the preferred option, but requires a lot of setup and maintenance |
  | Read The Docs | Cost              |

### Consequences

- We may have to migrate the wiki again in the future if we decide that GitHub doesn't offer us enough flexibility or accessibility for non-technical editors.
- The current team members will need to learn markdown in order to edit the wiki.
- Some sort of markdown style guide for the wiki may need to be created, if we want to maintain consistency.
