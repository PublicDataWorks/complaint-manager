import React from "react";
import {
  generateMenuOptions,
  searchParagraphMenu,
  searchRuleMenu
} from "./generateMenuOptions";

describe("generateMenu", () => {
  test("generateMenuOptions should generate menu options with provided values", () => {
    const values = [["Value1", 1], ["Value2", 2], ["SpecialValue3", 3]];

    const options = generateMenuOptions(values);

    expect(options).toEqual(
      expect.arrayContaining([
        {
          label: "Value1",
          value: 1
        },
        {
          label: "Value2",
          value: 2
        },
        {
          label: "SpecialValue3",
          value: 3
        }
      ])
    );
  });

  test("generateMenuOptions should not add empty option when flag is set", () => {
    const values = [["Value1", 1], ["Value2", 2], ["Value3", 3]];
    const options = generateMenuOptions(values, null, true);

    expect(options).toEqual([
      { label: "Value1", value: 1 },
      { label: "Value2", value: 2 },
      { label: "Value3", value: 3 }
    ]);
  });
});

describe("incident details menus", () => {
  test("should allow optional values for menu items", () => {
    const districts = [["Any district", ""], "1st district"];

    const menuOptions = generateMenuOptions(districts);

    expect(menuOptions).toEqual(
      expect.arrayContaining([
        {
          label: "Any district",
          value: ""
        },
        {
          label: "1st district",
          value: "1st district"
        }
      ])
    );
  });
});

describe("allegations menus", () => {
  test("should return rule menu based on allegation data", () => {
    const allegations = [
      { rule: "RULE 1", paragraphs: ["PARAGRAPH 1", "PARAGRAPH 2"] }
    ];
    const expectedMenu = generateMenuOptions([
      ["Select a Rule", ""],
      ["Rule 1", "RULE 1"]
    ]);
    const actualMenu = searchRuleMenu(allegations);

    expect(actualMenu).toEqual(expectedMenu);
  });

  test("should return paragraph menu based on allegation data", () => {
    const allegations = [
      { rule: "RULE 1", paragraphs: ["PARAGRAPH 1", "PARAGRAPH 2"] },
      { rule: "RULE 2", paragraphs: ["PARAGRAPH 3"] }
    ];
    const rule = allegations[0].rule;
    const expectedMenu = generateMenuOptions([
      ["Select a Paragraph", ""],
      ["Paragraph 1", "PARAGRAPH 1"],
      ["Paragraph 2", "PARAGRAPH 2"]
    ]);
    const actualMenu = searchParagraphMenu(allegations, rule);

    expect(actualMenu).toEqual(expectedMenu);
  });
});
