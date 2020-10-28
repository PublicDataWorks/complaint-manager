import React from "react";
import { Table, TableBody } from "@material-ui/core";

import { ChangeOfficer } from "../OfficerSearch/OfficerSearchResults/officerSearchResultsRowButtons";
import OfficerSearchTableHeader from "../OfficerSearch/OfficerSearchTableHeader";
import OfficerSearchResultsRow from "../OfficerSearch/OfficerSearchResults/OfficerSearchResultsRow";

const SelectedOfficerDisplay = ({
  caseId,
  dispatch,
  officerSearchUrl,
  selectedOfficer
}) => (
  <Table style={{ marginBottom: "32px" }}>
    <OfficerSearchTableHeader />
    <TableBody>
      <OfficerSearchResultsRow officer={selectedOfficer}>
        <ChangeOfficer
          caseId={caseId}
          dispatch={dispatch}
          officerSearchUrl={officerSearchUrl}
        >
          change
        </ChangeOfficer>
      </OfficerSearchResultsRow>
    </TableBody>
  </Table>
);

export default SelectedOfficerDisplay;
