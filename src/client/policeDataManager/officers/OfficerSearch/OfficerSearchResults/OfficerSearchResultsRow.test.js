import OfficerSearchResultsRow from "./OfficerSearchResultsRow";
import { mount } from "enzyme";
import React from "react";
import Officer from "../../../../../sharedTestHelpers/Officer";
import { Table, TableBody } from "@material-ui/core";

test("it can render officer search results with correct styles", () => {
  const officer = new Officer.Builder()
    .defaultOfficer()
    .withWorkStatus("Inactive")
    .withOfficerDistrict("1st District")
    .withDistrictId(1)
    .build();
  const wrapper = mount(
    <Table>
      <TableBody>
        <OfficerSearchResultsRow officer={officer} />
      </TableBody>
    </Table>
  );

  expect(wrapper).toMatchSnapshot();
});
