import React from "react";
import {
  generateMenu,
  searchParagraphMenu,
  searchRuleMenu,
  titleMenu
} from "./generateMenus";
import { mount } from "enzyme";
import { Select } from "@material-ui/core";

const getMenuOptions = mountedComponent => {
  return mountedComponent.find('li[role="option"]').map(node => node.text());
};

describe("civilian info dropdown menus", () => {
  test("title menu should contain all required values", () => {
    const titleMenuComponent = mount(
      <Select open={true} value="">
        {titleMenu}
      </Select>
    );

    const options = getMenuOptions(titleMenuComponent);

    expect(options).toMatchSnapshot();
  });
});

describe("generateMenu", () => {
  test("generateMenu should generate menu with provided values", () => {
    const values = [["Value1", 1], ["Value2", 2], ["SpecialValue3", 3]];

    const generateMenuComponent = mount(
      <Select open={true} value="">
        {generateMenu(values)}
      </Select>
    );

    const options = getMenuOptions(generateMenuComponent);

    expect(options).toEqual(values.map(entry => entry[0]));
  });
});

describe("incident details menus", () => {
  test("should allow optional values for menu items", () => {
    const districts = [["Any district", ""], "1st district"];
    const districtsMenuComponent = mount(
      <Select value="">{generateMenu(districts)}</Select>
    );

    districtsMenuComponent.find('[role="button"]').simulate("click");

    const options = districtsMenuComponent.find('li[role="option"]');

    const anyDistrictOption = options.first();
    expect(anyDistrictOption.text()).toEqual("Any district");
    expect(anyDistrictOption.props()["data-value"]).toEqual("");

    const firstDistrictOption = options.last();
    expect(firstDistrictOption.text()).toEqual("1st district");
    expect(firstDistrictOption.props()["data-value"]).toEqual("1st district");
  });
});

describe("allegations menus", () => {
  test("should return rule menu based on allegation data", () => {
    const allegations = [
      { rule: "RULE 1", paragraphs: ["PARAGRAPH 1", "PARAGRAPH 2"] }
    ];
    const expectedMenu = generateMenu([
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
    const expectedMenu = generateMenu([
      ["Select a Paragraph", ""],
      ["Paragraph 1", "PARAGRAPH 1"],
      ["Paragraph 2", "PARAGRAPH 2"]
    ]);
    const actualMenu = searchParagraphMenu(allegations, rule);

    expect(actualMenu).toEqual(expectedMenu);
  });
});
