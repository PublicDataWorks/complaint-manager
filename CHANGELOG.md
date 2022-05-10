# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [3.50.1](https://github.com/PublicDataWorks/police_data_manager/compare/v3.50.0...v3.50.1) (2022-05-10)


### Bug Fixes

* Isabel/Andrew [[#129](https://www.pivotaltracker.com/story/show/129)] unhardcoded the bucket name when retrieving signatures ([c70094e](https://github.com/PublicDataWorks/police_data_manager/commit/c70094edef61a09fcd9689c1db35ffbd5dfb6120))

## [3.50.0](https://github.com/PublicDataWorks/police_data_manager/compare/v3.49.1...v3.50.0) (2022-05-09)

### [3.49.1](https://github.com/PublicDataWorks/police_data_manager/compare/v3.49.0...v3.49.1) (2022-04-05)


### Bug Fixes

* Andrew [[#000](https://www.pivotaltracker.com/story/show/000)] fixed feature toggle preProd flag ([a907aa8](https://github.com/PublicDataWorks/police_data_manager/commit/a907aa81f73e79bdb2ef7e1df33ae1441e8f7279))
* Andrew [[#000](https://www.pivotaltracker.com/story/show/000)] fixed typo in config.yml so that Google Maps API will work in Production again ([eab14d2](https://github.com/PublicDataWorks/police_data_manager/commit/eab14d2d0a4119dbb97486a51be0b3d2c6fd1495))

## [3.49.0](https://github.com/PublicDataWorks/police_data_manager/compare/v3.48.0...v3.49.0) (2022-04-05)


### Bug Fixes

* Andrew [[#114](https://www.pivotaltracker.com/story/show/114)] fixes dirty field data being saved when switching to Unknown ([f88cb77](https://github.com/PublicDataWorks/police_data_manager/commit/f88cb774b4c68ccb9a999696ab382f3bf92c2eb7))
* Andrew [[#114](https://www.pivotaltracker.com/story/show/114)] fixes dirty field data being saved when switching to Unknown ([3482adc](https://github.com/PublicDataWorks/police_data_manager/commit/3482adc49afa4deaa33d016a3e5a08c7eab5c093))
* Andrew [[#114](https://www.pivotaltracker.com/story/show/114)] fixes Unknown issues on Civilian Dialog on case details page ([e19eb6e](https://github.com/PublicDataWorks/police_data_manager/commit/e19eb6ec3de68d36588cc3d7f982aefe573192e8))
* Andrew [[#114](https://www.pivotaltracker.com/story/show/114)] fixes Unknown issues on Civilian Dialog on case details page ([fd51879](https://github.com/PublicDataWorks/police_data_manager/commit/fd51879d96494364a5624b28730f15a26573cd5b))
* Andrew [[#117](https://www.pivotaltracker.com/story/show/117)] fixes search bug that doesn't unset the error message ([e9428c7](https://github.com/PublicDataWorks/police_data_manager/commit/e9428c70c48358efe3e8962f7c9cf4a35e941986))
* Andrew [[#117](https://www.pivotaltracker.com/story/show/117)] fixes search bug that doesn't unset the error message ([9afe92e](https://github.com/PublicDataWorks/police_data_manager/commit/9afe92eede816979ce786f6735e8b97d8e01b1cd))

## [3.48.0](https://github.com/PublicDataWorks/police_data_manager/compare/v3.47.0...v3.48.0) (2022-02-24)


### Bug Fixes

* Andrew [[#000](https://www.pivotaltracker.com/story/show/000)] fixed public map showing while the feature flag is off ([f48ed25](https://github.com/PublicDataWorks/police_data_manager/commit/f48ed256bcf253049982dd78993ba7461c9af1ad))

## [3.47.0](https://github.com/PublicDataWorks/police_data_manager/compare/v3.46.0...v3.47.0) (2022-02-08)


### Features

* Andrew [[#84](https://www.pivotaltracker.com/story/show/84)] added query to getData and getPublicData to get a count of complaints by district ([ae2446e](https://github.com/PublicDataWorks/police_data_manager/commit/ae2446ef799126902f339840294d191268f2f447))


### Bug Fixes

* Andrew [[#93](https://www.pivotaltracker.com/story/show/93)] fixed missing case note action in case history ([0e69113](https://github.com/PublicDataWorks/police_data_manager/commit/0e691136a35108370da62b85a519bb783558a263))

## 3.46.0 (2022-01-25)


### Features

* Cat/Andrew/Lex [[#94](https://www.pivotaltracker.com/story/show/94)] added dropdown to visualizations on private dashboard ([4d64de5](https://github.com/PublicDataWorks/police_data_manager/commit/4d64de533e178f1c10d47fefbb54329bd48cb847))
* Lex/Andrew/Cat [[#95](https://www.pivotaltracker.com/story/show/95)] setup all data dashboard queries on the backend to take a date range ([fba4020](https://github.com/PublicDataWorks/police_data_manager/commit/fba402053c680a6c389acd733e5ac88ecba22388))


### Bug Fixes

* Lex/Andrew/Cat [[#94](https://www.pivotaltracker.com/story/show/94)] fixed truncated visualization on private data dashboard ([c1219ba](https://github.com/PublicDataWorks/police_data_manager/commit/c1219ba9cdb5899523dffff273487b34c53c154e))
* Lex/Andrew/Cat [[#95](https://www.pivotaltracker.com/story/show/95)] fixed bug on public data handler that was mishandling inputs ([3b4666c](https://github.com/PublicDataWorks/police_data_manager/commit/3b4666c24fdad8b03b2c573d9278c0ba5fab82bd))

## 3.45.0 (2022-01-21)


### Features

* Andrew [[#178385782](https://www.pivotaltracker.com/story/show/178385782)] updates the sender of the referral letter when the letter is created or previewed ([5284d3d](https://github.com/PublicDataWorks/police_data_manager/commit/5284d3d6a856fabd0dcf4f12628b4d276af05e06))
* Andrew [[#82](https://www.pivotaltracker.com/story/show/82)] default sort of cases puts Ready for Review cases on top ([9934109](https://github.com/PublicDataWorks/police_data_manager/commit/9934109de6bd07ba5de198d5d352ee94dbeb3e84))
* Andrew [[#85](https://www.pivotaltracker.com/story/show/85)] added narrative summary and details to the search index ([9e5a735](https://github.com/PublicDataWorks/police_data_manager/commit/9e5a735b5d2a80fa7aa19b3378bebf76bf17365f))
* Andrew [[#86](https://www.pivotaltracker.com/story/show/86)] enabled differentiating known and unknown anonymous ([7599d79](https://github.com/PublicDataWorks/police_data_manager/commit/7599d7956793aeccb496451bbc2745a7235be1f7))
* Andrew/Karan [[#80](https://www.pivotaltracker.com/story/show/80)] Makes feature flags available within instance files ([0bc47b3](https://github.com/PublicDataWorks/police_data_manager/commit/0bc47b34fd8792626b9d5cb35ead56091d832dec))
* Andrew/Karan [OS] moved pdm-docs to police-data-manager project ([306b569](https://github.com/PublicDataWorks/police_data_manager/commit/306b569eb3589c5a96284260625fb1043b1fc548))
* Cat/Andrew/Lex [[#94](https://www.pivotaltracker.com/story/show/94)] added dropdown to visualizations on private dashboard ([4d64de5](https://github.com/PublicDataWorks/police_data_manager/commit/4d64de533e178f1c10d47fefbb54329bd48cb847))


### Bug Fixes

* Andrew/Karan [[#88](https://www.pivotaltracker.com/story/show/88)] updated table styling so that it uses the same background color as the page as a whole ([0f3c196](https://github.com/PublicDataWorks/police_data_manager/commit/0f3c1960129b108203c653855c042192ac2d03a3))
* Lex/Andrew/Cat [[#94](https://www.pivotaltracker.com/story/show/94)] fixed truncated visualization on private data dashboard ([c1219ba](https://github.com/PublicDataWorks/police_data_manager/commit/c1219ba9cdb5899523dffff273487b34c53c154e))

## 3.44.0 (2022-01-20)


### Features

* Cat/Andrew/Lex [[#94](https://www.pivotaltracker.com/story/show/94)] added dropdown to visualizations on private dashboard ([4d64de5](https://github.com/PublicDataWorks/police_data_manager/commit/4d64de533e178f1c10d47fefbb54329bd48cb847))

## 3.43.0 (2022-01-12)


### Features

* Andrew [[#178385782](https://www.pivotaltracker.com/story/show/178385782)] updates the sender of the referral letter when the letter is created or previewed ([5284d3d](https://github.com/PublicDataWorks/police_data_manager/commit/5284d3d6a856fabd0dcf4f12628b4d276af05e06))
* Andrew [[#82](https://www.pivotaltracker.com/story/show/82)] default sort of cases puts Ready for Review cases on top ([9934109](https://github.com/PublicDataWorks/police_data_manager/commit/9934109de6bd07ba5de198d5d352ee94dbeb3e84))
* Andrew [[#85](https://www.pivotaltracker.com/story/show/85)] added narrative summary and details to the search index ([9e5a735](https://github.com/PublicDataWorks/police_data_manager/commit/9e5a735b5d2a80fa7aa19b3378bebf76bf17365f))
* Andrew [[#86](https://www.pivotaltracker.com/story/show/86)] enabled differentiating known and unknown anonymous ([7599d79](https://github.com/PublicDataWorks/police_data_manager/commit/7599d7956793aeccb496451bbc2745a7235be1f7))
* Andrew/Karan [[#80](https://www.pivotaltracker.com/story/show/80)] Makes feature flags available within instance files ([0bc47b3](https://github.com/PublicDataWorks/police_data_manager/commit/0bc47b34fd8792626b9d5cb35ead56091d832dec))
* Andrew/Karan [OS] moved pdm-docs to police-data-manager project ([306b569](https://github.com/PublicDataWorks/police_data_manager/commit/306b569eb3589c5a96284260625fb1043b1fc548))


### Bug Fixes

* Andrew/Karan [[#88](https://www.pivotaltracker.com/story/show/88)] updated table styling so that it uses the same background color as the page as a whole ([0f3c196](https://github.com/PublicDataWorks/police_data_manager/commit/0f3c1960129b108203c653855c042192ac2d03a3))

### 3.42.4 (2021-12-02)
