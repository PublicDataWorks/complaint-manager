---
layout: default
title: Introduction to Police Data Manager
parent: Business Content
---
# Introduction to Police Data Manager
## Background and Purpose
[Police Data Manager](https://github.com/PublicDataWorks/police_data_manager) (PDM) was originally created for the Office of the Orleans Independent Police Monitor ([OIPM](http://nolaipm.gov/about-oipm/)). The OIPM is an independent, civilian police oversight agency created in August of 2009. One responsibility of the OIPM is to offer complaint intake services to the community to assist in raising complaints to the New Orleans Police Department. 

Before Police Data Manager was created the OIPM faced challenges with tracking, managing, and collaborating on complaint records. Complaint Intake Specialists working at the OIPM communicated with civilian and officer complainants in order to collect notes so that they could produce a referral letter to be sent to the NOPD. OIPM's complaint intake process would take days or weeks so that Complaint Intake Specialist could gather the necessary details about the officers involved, the time and location of the incident, as well as complainants' narratives. Complaint Intake Specialists also considered the accused officer's disciplinary history and suggested complaint classifications and recommended actions to be included within referral letters. 

Coordination between Complaint Intake Specialists over these days and weeks to process individual complaints was not a seamlessly collaborative effort, nor was there a clearly defined process to follow when collecting complaint information. Also, processed complaints were only available to review individually and no means to track complaint data collectively existed for analysis. OIPM helped influence the direction of PDM with these challenges in mind. 

## What is PDM?
The Police Data Manager is an open source tool meant to aid civilian police oversight agencies in generating complaint data. PDM is designed to be fully integrated into the workflows of these oversight agencies, enabling cities to enhance the capacity of citizens to hold public institutions accountable. 

With PDM organizations can align their processes to produce more consistent and effective complaints. Collecting complaint details (i.e. persons involved, incident time and location, complainant narratives, etc.) is captured in PDM's letter generation flow. Collaboration is encouraged through centralized case notes and notifications while also maintaining accountability through audit logs and complaint history. 

Additionally, the tool's carefully designed UI helps users to communicate with each other on specific complaints, virtually sign referral letters, find incident addresses, and search through existing complaints. 

This tool also enables analysis of complaint data through visualizations. We have recently introduced public facing data portals to further empower and advance the impact of civilian police oversight agencies.

## Feature Highlights
### Search
The new Search feature is a full text search that allows for a simple and intuitive way for users to find specific complaint data. Previously users were only able to browse the list of complaints by sorting on certain fields. With the new Elasticsearch-based feature, users can search complaints based on various fields (such as complainant names, accused officer names, tags, etc) simply by entering a search term into a single search box. Results are displayed in separate categories to highlight which field they match for easier discovery. 

### Visualizations
In order to understand trends, highlight effective strategies, or identify problem areas—complaints need to be measured together. Within PDM there is a dashboard that offers complaint data for analysis using data visualizations. These visualizations show the total complaints for a specific timeframe separated by a particular attribute such as complainant type or intake source. There is also a breakdown of tag usage within Police Data Manager showing the top, most-used tags and the number of times they were added onto a case. 

### Case Notes and Notifications
Case Notes are a way for users to record information about complaint processes that can occur outside of the PDM application (such as contacting complainants). There is also an ability to mention other PDM users in a case note which will alert that user and bring their attention to that complaint. Mentioned users are notified with a badge alert in the header of each page that can be followed to the exact complaint with the case note in question highlighted. These case notes and notifcations encourage collaboration and ensure faster responses to improve complaint intake cycle time. 

### Tags
The tagging feature allows Complaint Intake Specialists to add an additional attribute to complaints. Users are able to create, add, and remove tags from various complaints with this feature. Tags are a useful tool for grouping complaints together to identify trends and tell a bigger story. 


### Auditing
The auditing feature captures information around varying user actions within the application. Auditing aids civilian police oversight agencies by generating an automated record of all data changes, data accesses, and logins/logouts for every user. Additionally, these records are easily exported from the application as .csv files. The export of cases and the audits themselves are also recorded in the audit logs. The PDM application bundles information for a particular complaint within the *Case History* section of a complaint's *Case Details* page. The information there will relate only to the complaint a user is currently viewing.

## Product Demo

## Testimonials / Social Proof

