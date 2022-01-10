---
layout: default
title: Local Setup Instructions
parent: New City Setup
grand_parent: Technical Content
---

# *New City: Local Setup Instructions*

We’re so glad you have decided to use our Police Data Manager tool! This guide provides instructions for setting up your Police Data Manager and Instance Files locally in order to run and customize the tool for your desired city.


## GETTING STARTED


### Introduction

Follow this [link](https://publicdataworks.github.io/police_data_manager/business-content/introduction-to-police-data-manager.html) to view the introduction to the Police Data Manager tool.
### Clone Police Data Manager Repository

Follow this [link](https://github.com/PublicDataWorks/police_data_manager.git) to view and clone the **police_data_manager** Repository in Github.


## SETTING UP INSTANCE FILES REPO


### Clone Instance Files Repository

Follow this [link](https://github.com/PublicDataWorks/instance_files_pm.git) to view and clone the **instance_files_pm** Repository in Github.


### Test & View Locally

In order to test PDM locally, you can setup the `REACT_APP_INSTANCE_FILES_DIR` environment variable on your local machine to point to the `instance-files` directory within this repository. This will allow the PDM application to read from this absolute path and tailor the application to your cities requirements.

For Mac:
Add the absolute path of your instance-files folder location in .profile or .zshrc

For Linux:
Add the absolute path of your instance-files folder location in .bash_profile or .bashrc

For Windows:
Search in the start menu for "environment variables" and choose either "Edit system environment variables" (only if you have admin access) or "Edit environment variables for your account" and add the absolute path of your instance-files folder location using the Windows GUI tool

**How?**

* In your terminal, navigate inside the instance-files folder after cloning the repo
* enter the command `pwd`  and copy path that is outputted
* open the environment file (we're using .zshrc for this example) with your desired text editor and set your REACT_APP_INSTANCE_FILES_DIR environment variable.
  * In terminal: open ~/.zshrc
  * In file: export REACT_APP_INSTANCE_FILES_DIR=“`paste path here`”
* enter the command `source ~/.zshrc`
  * **tip:** exit out your terminals for source to take effect. To double check reopen your terminal and enter `echo $REACT_APP_INSTANCE_FILES_DIR` , you should see the path that you pasted.

**Run App**

* Start the application with `docker-compose up app` command
* Point your browser to `https://localhost/`



## CHANGE CITY INSTANCES


The below checklist is required for displaying your specific city’s details in the Police Data Manager tool. 

**Helpful Tip:** In your editor of choice, search in the **instance-files** folder for any occurrences of the below dummy data. **All** of these occurrences must be substituted with your new city’s data.


### Letter Templates

*Feel free to change any of the content of the letter templates to best reflect your city’s or organization’s current misconduct letter templates or information.*

Located in **/instance-files/letterBody.tpl**


* Change `Office of the Police Monitor (PM)` to reflect the name of your organization.
* Change `Grenville City` to reflect your city name.
* Change `Code Section 1-2212 (the Police Monitors Ordinance)` to reflect your city's ordinance code.
* Change all occurrences of `PM` to reflect your organization’s acronyms. 
* Change all occurrences of `GCPD` to reflect your city's police department.
* Change the contact `John A Simms or Nina S Ambroise` to reflect the name(s) of your organization’s Police Monitor(s) and Complaint Intake Specialist(s).

Located in **/instance-files/referralLetterPdf.tpl**



* Substitute the below information with your organization name, address, phone, and fax (if applicable). 

```
OFFICE OF THE POLICE MONITOR 
966 Morningview Lane | Grenville, WI | 53540 
Phone (641) 892-7222| Fax (414) 335-3049
```


* Change the name `JOHN A SIMMS` and title `POLICE MONITOR` to reflect the name(s) of your organization’s police monitor(s).

Located in **/instance-files/complainantLetterPdf.tpl**



* Substitute the below information with your organization name, address, phone, and fax (if applicable). 

```
OFFICE OF THE POLICE MONITOR 
966 Morningview Lane | Grenville, WI | 53540 
Phone (641) 892-7222| Fax (414) 335-3049
```


* Change the name `JOHN A SIMMS` and title `POLICE MONITOR` to reflect the name(s) of your organization’s police monitor(s).
* Change all occurrences of `PM` to reflect your organization’s acronyms. 
* Change all occurrences of `GCPD` to reflect your city's police department.
* Change `Grenville City` to reflect your city name.
* Change the number `(641) 892-7222` to reflect your organization’s number.
* Change the email `policemonitor@pm.ex` to reflect your organization’s email.
* Change the name `Nina S Ambroise` and title `Complaint Intake Consultant` to reflect your organization’s intake specialist’s name and title. 
* Change the filename `nina_s_ambroise.png` to your organization’s intake specialist's name/corresponding signature filename.


### Letter Signatures

Located in /**instance-files/images**

* Delete `john_a_simms.png` and add a PNG of your police monitor’s signature (or whoever will be signing off on referral letters).
* Delete `nina_s_ambroise.png` and add a PNG of your intake specialist's signature (or whoever will be signing off on complainant letters).

Located in **instance-files/content.json**



* Change the below to reflect the name and signature file of your police monitor (or whoever will be signing off on letters). 
```
"JOHN": {`
   "name": "John A Simms",`
   "signature": "file:/app/src/instance-files/images/john_a_simms.png"
```


### Letterhead Logos

Located in **/instance-files/images**



* Change the **icon.ico** file to reflect your organization’s icon.

    *Image size: 828 × 755 pixels*

* Change the **header_text.png** file to reflect your city and organization name.

    *Image size: 1079 × 158 pixels*


Located in **/instance-files**



* Change the **favicon.ico** file to reflect your organization’s icon (i.e. same as icon.ico).

Located in **/instance-files/public**



* Change the **favicon.ico** file to reflect your organization’s icon (i.e. same as icon.ico).


### Letter Defaults

Located in **/instance-files/helpers.js**



* Change all occurrences of `PM` to reflect your organization’s acronyms. 

Located in /**instance-files/referralLetterDefaults.js**



* Change the name `Karla A Coriell` to reflect the name of your city’s Deputy Superintendent.
* Change `Grenville City` to reflect your city name.
* Change the address `128 Central Avenue\nGrenville, WI 53540` to reflect your city’s police department address.
* Change the name of the sender `John A Simms` to reflect the name of your organization’s Police Monitor (or whoever will be signing off on letters).
* Change title, and number of the sender `\nPolice Monitor\n231-873-5975` to reflect the title, and number of your organization’s Police Monitor (or whoever will be signing off on letters).
* Change the signature of your sender from `john_a_simms.png` to the name of the file used for your sender’s signature. 


### Default Constants

Located in **/instance-files/constants.js**
* Change the value of **ORGANIZATION** from `PM` to the acronym of your organization.
* Change the value of **ORGANIZATION_TITLE** from `Office of the Police Monitor` to the name of your organization.
* Change the value of **CITY** from `City of Grenville` to the name of your city.
* Change the value of **PD** from `GCPD` to the  acronym of your city’s police department.
* Change the values in **PERSON_TYPE** if necessary to update the following (the types themselves: CIVILIAN, KNOWN_OFFICER, UNKNOWN_OFFICER, and CIVILIAN_WITHIN_PD cannot be changed at this time, but the values passed to them can be changed)
  * How each type of person is described (`description`)
  * How the person is described as an employee (`employeeDescription`; only for employees of the police department)
  * How the person type is abbreviated for use in case reference ids and other representations (`abbreviation`; limit 3 characters)
  * How the person type is represented in a list of complainant types (`complainantLegendValue`)
  * How the person type is represented publically in data visualizations if different from `complainantLegendValue` (`publicLegendValue`)

#### Map Visualization 
The map visualization is configured in the **MAP_CONFIG** object
* Change value of **CENTER** with the latitude and longitude where you want the map to be centered when it's loaded.
* Change value of **DEFAULT_ZOOM** that suits how zoomed in you want the map to be when its loaded.
* Change value of **LAYERS** to empty array  `[]` to start with, see  below for guidance to create your own map layers.
##### Creating Map Layers
The map visualization is created by using `Plotly` and `Mapbox`
* Plotly mapbox reference: https://plotly.com/javascript/reference/layout/mapbox/
* Mapbox GL JS API Reference: https://docs.mapbox.com/mapbox-gl-js/api/
* Plotly JS trace reference: https://plotly.com/javascript/reference/
* Plotly JS Map Examples: https://plotly.com/javascript/maps/
* What goes into the **LAYERS** array
  * text: the text of the checkbox that toggles the layer on and off
  * layers: an array of objects that will be passed to layout.mapbox
  * data: an array of objects that will be passed to data
  * checkboxColor: a CSS color value to be used for the color of the checkbox if you don't want the default grey
  * Each entry in **LAYERS** can add multiple literal layers or data fields to the map that are all controlled by the same checkbox


  



### Seed Files

Located in **instance-files/localstack-seed-files**

Replace the following files with your own or edit with your specific city’s data:



* allegations.csv
* caseNoteActions.csv
* civilianTitles.csv
* classificationOptions.csv
* districts.csv
* genderIdentities.csv
* howDidYouHearAboutUsSources.csv
* intakeSources.csv
* officerHistoryOptions.csv
* officerSeedData.csv
* raceEthnicities.csv
* recommendedActions.csv


### Other

Located in **instance-files/tests/e2e/nightwatch.conf.js**



* Change the value of the ci **launch_url** from `https://pm-ci.herokuapp.ex/` to the link of your heroku app in CI. 
* Change the value of the staging **launch_url** from `https://pm-staging.herokuapp.ex/` to the link of your heroku app in Staging. 

Located in **instance-files/tag-glossary.json**



* Change all occurrences of `PM` to reflect your organization’s acronyms. 
* Change all occurrences of `GCPD` to reflect your city's police department.


## OTHER RESOURCES


### Contact App Maintainers

Follow this [link](https://publicdataworks.github.io/police_data_manager/common-content/communications.html) to get in contact with the maintainers of the application.


### FAQ

Follow this [link](https://publicdataworks.github.io/police_data_manager/technical-content/faq.html) to view the useful technical tools and FAQ.

## Known Limitations & Production Setup 

As you bring up the application with this local setup, you will be missing some functionality of the real deployed version.
  1. Google Maps API integration
  2. Authentication using Auth0
  3. Storage of generated letters and attachment using AWS S3

If you would like to have your own fully functioning deployable version, follow this [link](https://publicdataworks.github.io/police_data_manager/technical-content/new-city-setup/new-city-production-setup.html) to get started.

