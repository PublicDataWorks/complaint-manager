import React from "react";
import { MenuItem } from "material-ui";

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

export const userActions = generateMenu([
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

export const searchRuleMenu = generateMenu([
  ["Select a Rule", ""],
  ["Rule 2: Moral Conduct", "RULE 2: MORAL CONDUCT"],
  "Rule 3: Professional Conduct",
  "Rule 4: Performance of Duty",
  "Rule 5: Restricted Activities",
  "Rule 7: Departmental Property"
]);

export const searchParagraphMenu = rule =>
  generateMenu(mapRulesToParagraphs[rule]);

const mapRulesToParagraphs = {
  "RULE 2: MORAL CONDUCT": [
    ["Select a Paragraph", ""],
    ["Paragraph 01 - Adherence To Law", "PARAGRAPH 01 - ADHERENCE TO LAW"],
    ["Paragraph 02 - Courtesy", "PARAGRAPH 02 - COURTESY"],
    [
      "Paragraph 03 - Honesty And Truthfulness",
      "PARAGRAPH 03 - HONESTY AND TRUTHFULNESS"
    ],
    ["Paragraph 04 - Discrimination", "PARAGRAPH 04 - DISCRIMINATION"],
    [
      "Paragraph 05 - Verbal Intimidation",
      "PARAGRAPH 05 - VERBAL INTIMIDATION"
    ],
    ["Paragraph 06 - Unauthorized Force", "PARAGRAPH 06 - UNAUTHORIZED FORCE"],
    ["Paragraph 07 - Courage", "PARAGRAPH 07 - COURAGE"],
    [
      "Paragraph 08 - Failure to Report Misconduct",
      "PARAGRAPH 08 - FAILURE TO REPORT MISCONDUCT"
    ],
    [
      "Paragraph 09 - Failure to Cooperate/Withholding Information",
      "PARAGRAPH 09 - FAILURE TO COOPERATE/WITHHOLDING INFORMATION"
    ]
  ],
  "Rule 3: Professional Conduct": [
    ["Select a Paragraph", ""],
    "3:1 Professionalism",
    "3:11 Use of Tobacco",
    "3:13 Use of Social Media",
    "3:3 Neatness and Attire",
    "3:9 Use of Alcohol/Off Duty"
  ],
  "Rule 4: Performance of Duty": [
    ["Select a Paragraph", ""],
    "4(a) Neglect of Duty - General",
    "4(b) Enumerated Acts/Omissions",
    "4:1 Reporting for Duty",
    "4:10 Escort for Valuables or Money",
    "4:11 Body Worn Camera",
    "4:2 Instructions from Authoritative Source",
    "4:3 Devoting Entire Time to Duty",
    "4:4 Neglect of Duty  - General Supervisory Responsibility",
    "4:5 Ceasing to Perform Before End of Tour of Duty",
    "4:6 Leaving Assigned Area",
    "4:7 Leaving City While on Duty",
    "4:8 hours of Duty",
    "4:9 Safekeeping of Valuables by Police Department"
  ],
  "Rule 5: Restricted Activities": [
    ["Select a Paragraph", ""],
    "5:1 Fictitious Illness or Injury",
    "5:13 Rewards",
    "5:6 Acting in Civil Matters",
    "5:8 Civil Suits by Members"
  ],
  "Rule 7: Departmental Property": [
    ["Select a Paragraph", ""],
    "7:1 Use of Department Property",
    "7:2 Authorized Operator of Department Property",
    "7:3 Cleanliness of Department Vehicles",
    "7:4 Use of Emergency Equipment",
    "7:5 Statement of Responsibility",
    "7:6 Operations Manual",
    "7:7 Surrendering Department Property"
  ]
};
