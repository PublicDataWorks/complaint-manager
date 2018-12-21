import OfficerAllegationsDisplay from "./OfficerAllegationsDisplay";
import { mount } from "enzyme";
import React from "react";
import OfficerAllegationDisplay from "./OfficerAllegationDisplay";
import createConfiguredStore from "../../../createConfiguredStore";
import { Provider } from "react-redux";

describe("OfficerAllegationsDisplay", function() {
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
