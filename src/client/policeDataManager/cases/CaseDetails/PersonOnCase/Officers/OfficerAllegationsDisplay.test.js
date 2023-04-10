import React from "react";
import { Provider } from "react-redux";
import { mount } from "enzyme";
import OfficerAllegationsDisplay from "./OfficerAllegationsDisplay";
import OfficerAllegationDisplay from "./OfficerAllegationDisplay";
import createConfiguredStore from "../../../../../createConfiguredStore";

describe("OfficerAllegationsDisplay", function () {
  test("should render accused officer's allegations", () => {
    const officerAllegations = [
      {
        allegation: {
          id: 3,
          paragraph: "paragraph",
          rule: "rule",
          directive: "directive"
        },
        id: 1
      },
      {
        allegation: {
          id: 4,
          paragraph: "paragraph2",
          rule: "rule2",
          directive: "directive2"
        },
        id: 2
      }
    ];

    const wrapper = mount(
      <Provider store={createConfiguredStore()}>
        <OfficerAllegationsDisplay officerAllegations={officerAllegations} />
      </Provider>
    );

    expect(wrapper.find(OfficerAllegationDisplay).length).toEqual(2);
  });
});
