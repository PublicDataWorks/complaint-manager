import * as _ from "lodash";
import formatStringToTitleCase from "./formatStringToTitleCase";
import {
  ACCUSED,
  ALLEGATION_SEVERITY,
  COMPLAINANT,
  WITNESS
} from "../../../sharedUtilities/constants";

export const generateMenuOptions = (contents, extraMenuOption = null) => {
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
  if (extraMenuOption) {
    menuOptionsArray.unshift({ label: extraMenuOption, value: "" });
  }

  return menuOptionsArray;
};

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
