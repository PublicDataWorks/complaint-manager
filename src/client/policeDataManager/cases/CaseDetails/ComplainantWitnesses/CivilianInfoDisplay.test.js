import React from "react";
import { mount } from "enzyme";
import CivilianInfoDisplay from "./CivilianInfoDisplay";

describe("CivilianInfoDisplay", () => {
  test("should display N/A when value is falsy", () => {
    const displayWrapper = mount(
      <CivilianInfoDisplay
        display="Test Label"
        value={undefined}
        testLabel="testLabel"
      />
    );

    const displayedValue = displayWrapper
      .find('p[data-testid="testLabel"]')
      .text();

    expect(displayedValue).toEqual("N/A");
  });

  test("should display value when defined", () => {
    const expectedValue = "Some defined text";
    const displayWrapper = mount(
      <CivilianInfoDisplay
        display="Test Label"
        value={expectedValue}
        testLabel="testLabel"
      />
    );

    const displayedValue = displayWrapper
      .find('p[data-testid="testLabel"]')
      .text();

    expect(displayedValue).toEqual(expectedValue);
  });
});
