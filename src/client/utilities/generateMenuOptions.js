import React from "react";
import * as _ from "lodash";
import formatStringToTitleCase from "./formatStringToTitleCase";
import {
  ACCUSED,
  ALLEGATION_SEVERITY,
  COMPLAINANT,
  WITNESS
} from "../../sharedUtilities/constants";

export const generateMenuOptions = contents => {
  let menuOptionsArray = contents.map(content => {
    let value, label;
    if (typeof content === "string") {
      value = label = content;
    } else {
      label = content[0];
      value = content[1];
    }
    return {
      label,
      value
    };
  });
  menuOptionsArray.unshift({ label: "", value: "" });

  return menuOptionsArray;
};

export const searchDistrictMenu = generateMenuOptions([
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

export const inputDistrictMenu = generateMenuOptions([
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

export const caseNotes = generateMenuOptions([
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

export const roleOnCaseMenu = generateMenuOptions([
  ACCUSED,
  COMPLAINANT,
  WITNESS
]);
export const allegationSeverityMenu = generateMenuOptions(
  ALLEGATION_SEVERITY.ALL
);

export const searchRuleMenu = allegations => {
  allegations = _.sortBy(allegations, allegation => allegation.rule);
  const defaultValue = [["Select a Rule", ""]];
  const rules = allegations.map(allegation => [
    formatStringToTitleCase(allegation.rule),
    allegation.rule
  ]);
  return generateMenuOptions(defaultValue.concat(rules));
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
  return generateMenuOptions(defaultValue.concat(paragraphs));
};
