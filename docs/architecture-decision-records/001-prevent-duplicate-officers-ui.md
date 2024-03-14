---
layout: default
title: ADR 001 - Preventing duplicate officers from being displayed when searching within a case in NOIPM
parent: Architecture Decision Records
permalink: /adrs/adr-001
---

# 001 - Prevent duplicate officers from being displayed when searching within a case in NOIPM

### Date

01/25/2024

### Status

Proposed
{: .label .label-yellow }

### Context

[Issue #328](https://github.com/PublicDataWorks/complaint-manager/issues/328) – Do not display duplicated officers in the UI

- The `officers` table in NOIPM prod has a lot of duplicated data.
- When someone is creating or editing a case and searching for an officer, we don't want duplicates to be shown.
- We don't want to remove the duplicated data from the `officers` table because previous cases might be assigned to some of those officers, and we still want those to be searchable from the search bar on the main page.

### Decision

- An environment variable, `OFFICER_ROSTER_LATEST_DATE`,  was added to NOIPM production in Heroku.
  - When we receive a new list of officers from NOIPM, we will update the value of this variable in Heroku.
  - This value is in [epoch time](https://www.epochconverter.com/#:~:text=What%20is%20epoch%20time%3F,01T00%3A00%3A00Z%29.) format.
- We chose to create this environment variable rather than changing any database schemas to avoid having to do a database migration.
- Logic was added so that when searching for officers within a case, only officers with a `created_at` date equal to or after `OFFICER_ROSTER_LATEST_DATE` will be displayed.
- [Pull request](https://github.com/PublicDataWorks/complaint-manager/pull/453)

### Consequences

- The environment variable was created only in the production environment for NOIPM. Therefore, testing it locally or in CI or Staging environments will require a code change.
- To modify the environment variable on Heroku, NOIPM prod permissions are required.
- When the environment variable is updated, a new deploy to production will be necessary.
- We only expect to receive a new list of officers every ~6 months, so this operation will not have to be done often.
- Parts of the system in NOIPM that use the API endpoint /officers/search will be affected by this change.
- The Hawaii pipeline is not affected by this decision.

---