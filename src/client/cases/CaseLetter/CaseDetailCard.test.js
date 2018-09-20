import createConfiguredStore from "../../createConfiguredStore";
import { mount } from "enzyme/build/index";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import CaseDetailCard from "./CaseDetailCard";
import React from "react";

describe("Case Detail Card", function() {
  test("it renders correct number of complainants/witnesses", () => {
    const wrapper = mount(
      <Provider store={createConfiguredStore()}>
        <Router>
          <CaseDetailCard
            cardTitle={"Test Title"}
            cardData={[
              { "Civilian Name": "test name", Race: "test race" },
              {
                "Officer Name": "test officer",
                ID: "test ID",
                District: "test district"
              }
            ]}
          />
        </Router>
      </Provider>
    );

    const caseDetailCard = wrapper.find('[data-test="caseDetailCard"]').first();
    expect(
      caseDetailCard.find('[data-test="caseDetailCardItem"]').length
    ).toEqual(2);
  });

  test("it renders correctly when there are no witnesses", () => {
    const wrapper = mount(
      <Provider store={createConfiguredStore()}>
        <Router>
          <CaseDetailCard
            cardTitle={"Test Title"}
            cardData={["No witnesses have been added"]}
          />
        </Router>
      </Provider>
    );

    const caseDetailCard = wrapper.find('[data-test="caseDetailCard"]').first();
    expect(
      caseDetailCard.find('[data-test="caseDetailCardItem"]').length
    ).toEqual(1);
    expect(caseDetailCard.text()).toContain("No witnesses have been added");
  });

  test("it renders correct number of officers and allegations", () => {
    const wrapper = mount(
      <Provider store={createConfiguredStore()}>
        <Router>
          <CaseDetailCard
            cardTitle={"Test Title"}
            cardData={[{ "Officer Name": "test name", ID: "test id" }]}
            cardSecondTitle={"Allegations"}
            allegations={[
              { Rule: "test rule" },
              { Rule: "test rule 2" },
              { Rule: "test rule 3" }
            ]}
          />
        </Router>
      </Provider>
    );

    const caseDetailCard = wrapper.find('[data-test="caseDetailCard"]').first();
    expect(
      caseDetailCard.find('[data-test="caseDetailCardItem"]').length
    ).toEqual(1);
    expect(
      caseDetailCard.find('[data-test="caseDetailCardAllegation"]').length
    ).toEqual(3);
  });

  test("it renders correct number of officers when there are no allegations", () => {
    const wrapper = mount(
      <Provider store={createConfiguredStore()}>
        <Router>
          <CaseDetailCard
            cardTitle={"Test Title"}
            cardData={[{ "Officer Name": "test name", ID: "test id" }]}
            cardSecondTitle={"Allegations"}
            allegations={[]}
          />
        </Router>
      </Provider>
    );

    const caseDetailCard = wrapper.find('[data-test="caseDetailCard"]').first();
    expect(
      caseDetailCard.find('[data-test="caseDetailCardItem"]').length
    ).toEqual(1);
    expect(
      caseDetailCard.find('[data-test="caseDetailCardAllegation"]').length
    ).toEqual(0);
  });
});
