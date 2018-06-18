import React from "react";
import { mount } from "enzyme";
import { Table, TableBody } from "@material-ui/core";
import OfficerAllegations from "./OfficerAllegations";
import Allegation from "./Allegation";

describe("OfficerAllegations", function() {
  const caseId = 12;
  const caseOfficerId = 7;
  const officerAllegations = [
    {
      allegation: {
        id: 3,
        paragraph: "paragraph",
        rule: "rule",
        directive: "directive"
      },
      caseOfficerId,
      id: 1
    },
    {
      allegation: {
        id: 4,
        paragraph: "paragraph2",
        rule: "rule2",
        directive: "directive2"
      },
      caseOfficerId,
      id: 2
    }
  ];

  test("should render children for each officer allegation", () => {
    const wrapper = mount(
      <Table>
        <TableBody>
          <OfficerAllegations
            officerAllegations={officerAllegations}
            caseId={caseId}
          />
        </TableBody>
      </Table>
    );

    expect(wrapper.find(Allegation).length).toEqual(2);
  });

  test("should not render select button on allegation component", () => {
    const wrapper = mount(
      <Table>
        <TableBody>
          <OfficerAllegations
            officerAllegations={officerAllegations}
            caseId={caseId}
          />
        </TableBody>
      </Table>
    );

    expect(
      wrapper.find('[data-test="selectAllegationButton"]').exists()
    ).toBeFalsy();
  });
});
