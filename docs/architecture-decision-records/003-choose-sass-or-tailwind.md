---
layout: default
title: ADR 003 - Choose SASS or Tailwind CSS for custom styling in Complaint Manager 2.0 component library
parent: Architecture Decision Records
permalink: adrs/adr-003
---
 
# 003 - Choose SASS or Tailwind CSS for custom styling in Complaint Manager 2.0 component library

### Date

03/06/2024

### Status

Accepted
{: .label .label-green }

### Context

[Issue #502](https://github.com/PublicDataWorks/complaint-manager/issues/502) – Evaluate if we should use Tailwind CSS or SASS with MUI for Complaint Manager 2.0

#### Purpose

Building a component library based on MUI

#### Goal

Decide which tool (SASS or Tailwind) is better suited for adding custom styling on top of MUI components. We need to keep in mind scalability, ease of implementation/structuring, and ease of integration with MUI.

### Decision

We propose using SASS for the following reasons:

##### Flexibility and Customization

- SASS allows for creating custom styles and tailoring them to the specific needs of the component library, ensuring compatibility with MUI components and the overall design system of Complaint Manager 2.0.
- This is crucial for potentially unique styling requirements that might not be fully addressed by MUI's default styles.

##### Maintainability

- SASS features like variables, mixins, and nesting enable writing more maintainable and reusable stylesheets, especially important for a component library that will be used across multiple projects.
- Clear and consistent use of these features will simplify future modifications and extension of the component library.

#### Alternatives Considered

##### Tailwind CSS

- While Tailwind offers a rapid development approach, its utility-first nature might:
  -Limit customization, potentially hindering fine-tuning component styles beyond Tailwind's pre-built classes.
  -Introduce naming conflicts if Tailwind classes clash with MUI component class names.
- Additionally, adopting Tailwind might require additional learning and setup time for the development team.

#### Mitigation Strategies

##### Clear Documentation and Style Guides

We will create comprehensive documentation and style guides that:

- Clearly explain how to use SASS within the component library.
- Establish consistent naming conventions and coding practices to avoid conflicts with MUI and ensure maintainability.

##### Linting and Formatting

We will implement linting and formatting tools to:

- Enforce adherence to best practices and code quality.
- Catch potential errors and maintain consistency in the codebase.

### Consequences

- Increased complexity: Compared to plain CSS, SASS introduces additional complexity due to the preprocessor syntax and potential build setup.
- We believe that SASS aligns better with the project's requirements for customization, maintainability, scaling, and team familiarity with vanilla CSS. While acknowledging the potential increase in complexity, we will mitigate it through clear documentation, tooling, and established best practices.
