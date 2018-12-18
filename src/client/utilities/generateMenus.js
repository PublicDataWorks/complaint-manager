import React from "react";
import { MenuItem } from "@material-ui/core";
import * as _ from "lodash";
import formatStringToTitleCase from "./formatStringToTitleCase";
import {
  ACCUSED,
  COMPLAINANT,
  WITNESS,
  ALLEGATION_SEVERITY
} from "../../sharedUtilities/constants";

export const generateMenu = contents => {
  return contents.map(content => {
    let value, text;
    if (typeof content === "string") {
      value = text = content;
    } else {
      text = content[0];
      value = content[1];
    }
    return (
      <MenuItem key={value} value={value}>
        {text}
      </MenuItem>
    );
  });
};

export const genderIdentityMenu = generateMenu([
  "Unknown",
  "Female",
  "Male",
  "Trans Female",
  "Trans Male",
  "Other"
]);

export const raceEthnicityMenu = generateMenu([
  "Unknown",
  "American Indian or Alaska Native",
  "Asian Indian",
  "Black, African American",
  "Chinese",
  "Cuban",
  "Filipino",
  "Guamanian or Chamorro",
  "Hispanic, Latino, or Spanish origin",
  "Japanese",
  "Korean",
  "Mexican, Mexican American, Chicano",
  "Native Hawaiian",
  "Puerto Rican",
  "Vietnamese",
  "Samoan",
  "White",
  "Other Pacific Islander",
  "Other Asian",
  "Other"
]);

export const titleMenu = generateMenu([
  "N/A",
  "Dr.",
  "Miss",
  "Mr.",
  "Mrs.",
  "Ms."
]);

export const intakeSourceMenu = generateMenu([
  "Email",
  "Facebook",
  "In Person",
  "Instagram",
  "NOIPM Website",
  "Other",
  "Outreach Event",
  "Phone",
  "Remote Complaint Intake Site",
  "Twitter"
]);

export const searchDistrictMenu = generateMenu([
  ["Any District", ""],
  ["1st District", "First District"],
  ["2nd District", "Second District"],
  ["3rd District", "Third District"],
  ["4th District", "Fourth District"],
  ["5th District", "Fifth District"],
  ["6th District", "Sixth District"],
  ["7th District", "Seventh District"],
  ["8th District", "Eighth District"]
]);

export const inputDistrictMenu = generateMenu([
  ["Unknown", ""],
  ["1st District", "First District"],
  ["2nd District", "Second District"],
  ["3rd District", "Third District"],
  ["4th District", "Fourth District"],
  ["5th District", "Fifth District"],
  ["6th District", "Sixth District"],
  ["7th District", "Seventh District"],
  ["8th District", "Eighth District"]
]);

export const caseNotes = generateMenu([
  "Case briefing from NOPD",
  "Checked status",
  "Contacted complainant",
  "Contacted complainant support person",
  "Contacted NOPD",
  "Contacted outside agency",
  "Gathered information from outside source",
  "Memo to file",
  "Pulled docket from the court website",
  "Pulled information from NOPD databases",
  "Requested documents from other agency",
  "Requested information from NOPD",
  "Researched issue related to a complaint",
  "Sent closeout memo",
  "Sent notice of case review",
  "Sent notice of monitoring",
  "Sent supplemental complaint referral",
  "Miscellaneous"
]);

export const roleOnCaseMenu = generateMenu([ACCUSED, COMPLAINANT, WITNESS]);
export const allegationSeverityMenu = generateMenu(ALLEGATION_SEVERITY.ALL);

export const searchRuleMenu = allegations => {
  allegations = _.sortBy(allegations, allegation => allegation.rule);
  const defaultValue = [["Select a Rule", ""]];
  const rules = allegations.map(allegation => [
    formatStringToTitleCase(allegation.rule),
    allegation.rule
  ]);
  return generateMenu(defaultValue.concat(rules));
};

export const searchParagraphMenu = (allegations, rule) => {
  const allegation = allegations.find(allegation => allegation.rule === rule);
  const sortedParagraphs = _.sortBy(
    allegation.paragraphs,
    paragraph => paragraph
  );
  const defaultValue = [["Select a Paragraph", ""]];
  const paragraphs = sortedParagraphs.map(paragraph => [
    formatStringToTitleCase(paragraph),
    paragraph
  ]);
  return generateMenu(defaultValue.concat(paragraphs));
};
