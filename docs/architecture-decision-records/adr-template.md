---
layout: default
title: ADR Template
parent: Architecture Decision Records
permalink: adrs/adr-template
---

When creating a new ADR:

- Copy-paste this template, which can be found in this markdown file, `docs/architecture-decision-records/adr-template.md`.
- The document should be placed in `/docs/architecture-decision-records`.
- You will likely have two versions of the ADR title: a longer version, inserted in the template, and a shorter version for the file name.
- Name the file following the format `{000}-{short-title}.md`.
- In the section above this one in the markdown file:
  - Change the title to match the longer ADR title in the format "ADR {000} - {ADR long title}".
  - Change the permalink to the format `adrs/adr-{000}`.
- Be sure to remove this middle section before publishing the ADR.

[ADR resource](https://github.com/joelparkerhenderson/architecture-decision-record?tab=readme-ov-file)

---

# 000 - ADR title

### Date

The date of the architecture decision record.

### Status

Choose one of the following status labels:

Proposed
{: .label .label-yellow }
Accepted
{: .label .label-green }
Rejected
{: .label .label-red }
Deprecated
{: .label .label-red }
Superseded
{: .label .label-red }

### Context

What is motivating this decision or change? What is the context around the problem?

### Decision

What is the proposed change or decision? What alternatives were considered, and why did we choose this option?

### Consequences

What are the consequences of this decision? What becomes easier and what becomes more difficult?
