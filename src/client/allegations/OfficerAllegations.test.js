import React from "react";
import {mount} from "enzyme";
import OfficerAllegations from "./OfficerAllegations";

describe("OfficerAllegations", function() {
  const caseId = 12;
  const caseOfficerId = 7;
  const officerAllegations = [
    {
      allegation: {
        id: 3,
        paragraph: "paragraph1",
        rule: "A specific rule",
        directive: "directive1"
      },
      caseOfficerId,
      id: 1
    },
    {
      allegation: {
        id: 4,
        paragraph: "paragraph2",
        rule: "a very very specific rule",
        directive: "directive2"
      },
      caseOfficerId,
      id: 2
    }
  ];

  test("should render officer allegations", () => {
    const wrapper = mount(
      <OfficerAllegations
        officerAllegations={officerAllegations}
        caseId={caseId}
      />
    );

    const allegation1 = wrapper.find('[data-test="officerAllegation0"]').first()
    const allegation2 = wrapper.find('[data-test="officerAllegation1"]').first()

    expect(allegation1.text()).toContain("A Specific Rule");
    expect(allegation2.text()).toContain("A Very Very Specific Rule");
  });
});
