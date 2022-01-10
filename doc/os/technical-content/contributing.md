---
layout: default
title: Contributing
parent: Technical Content
---
# Contributor Guidelines
## Our Expectations
We hope that contributing to this project will be a rewarding experience for all our contributors. Notice something that can be improved? Feel free to take a stab at it!

General testing practices and expectations:
   * Think about edge cases and failure scenarios.
   * Make sure you write unit tests for your work.
   * Run all of the unit tests (server, worker, client, and end-to-end) to verify everything is working before submitting a pull request.
   * Manually test your work to make sure things look good in the browser (i.e. localhost).

## Getting Started
1. [Fork](https://docs.github.com/en/get-started/quickstart/fork-a-repo) the [repository](https://github.com/PublicDataWorks/police_data_manager) on GitHub 
2. [Clone](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository) the project
3. Follow [README](https://github.com/PublicDataWorks/police_data_manager/blob/master/README.md) on GitHub to set up local machine
4. Begin Contributing!
   
## Submitting Contributions
1. If everything looks good, first update your fork to make sure it’s up to date with the `master` branch of the main repo. 
   * Ensure your commit messages follow [Conventional Commit Format](https://www.conventionalcommits.org/en/v1.0.0/#summary)
   * Please use `rebase` instead of `merge` to keep your commits on top of the work that has already been committed:
     * `git fetch upstream` (make sure you have already set the upstream to [PDM GitHub Repo](https://github.com/PublicDataWorks/police_data_manager))
     * `git rebase upstream/master`
   * When you have a local commit, push it to your fork. 
3. Submit your pull request to the core repo. [How to Create a Pull Request from a Fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork)
4. A core team dev will then review the pull request. The code review itself will be done via GitHub pull request comments. They will let you know what, if anything, needs to be changed before final submission. 
5. Once your code has gone through the code review, the pull request will be approved and your code will be merged into master. At this point, you’re done and ready to contribute some more!

## Creating a Pull Request 
1. Raise the pull request to master on the main repository 
   - if changes includes a changes within `instance-files`, it should be indicated in the pull request description.
   - Make sure to fill out all the fields in the pull request template.
2.  Your changes should include unit tests that cover the changed functionality.  
   
## Suggesting a Feature/Enhancement
1. Raise an issue in the Police Data Manager project using the feature request template.
      - Make sure to fill out the fields in the template ( the more information we have, the better ).
2. Add `needs-review` and `feature` labels to the issue.
   
## Reporting a Bug 
1. Raise an issue in the Police Data Manager project using the bug template.
      - Make sure to fill out the fields in the template ( the more information we have, the better ).
2. Add `needs-review` and `bug` labels to the issue.

## Joining the Community 
*  [PDM Google Group](https://groups.google.com/u/4/g/police-data-manager)
*  Provide Helpful [Feedback](https://forms.gle/MS9LFTWG6tuaqSTD8)
  
## Helpful Resources 
* [Development Resources](https://publicdataworks.github.io/pdm-docs/technical-content/development-resources.html)
* [FAQs and Troubleshooting](https://publicdataworks.github.io/pdm-docs/technical-content/faq.html)



