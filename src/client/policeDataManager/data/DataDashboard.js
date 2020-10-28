import React, { Component } from "react";
import NavBar from "../shared/components/NavBar/NavBar";
import { policeDataManagerMenuOptions } from "../shared/components/NavBar/policeDataManagerMenuOptions";
import Visualization from "../../common/components/Visualization/Visualization";
import { QUERY_TYPES } from "../../../sharedUtilities/constants";

class DataDashboard extends Component {
  render() {
    return (
      <div>
        <NavBar menuType={policeDataManagerMenuOptions}>Data Dashboard</NavBar>
        <div
          style={{
            display: "flex",
            flexDirection: "column"
          }}
        >
          <Visualization
            data-testid={"intakeSourceGraph"}
            queryType={QUERY_TYPES.COUNT_COMPLAINTS_BY_INTAKE_SOURCE}
          />
          <br />
          <Visualization
            data-testid={"complainantTypeGraph"}
            queryType={QUERY_TYPES.COUNT_COMPLAINTS_BY_COMPLAINANT_TYPE}
          />
          <br />
          <Visualization
            data-testid={"complainantTypePast12MonthsGraph"}
            queryType={
              QUERY_TYPES.COUNT_COMPLAINTS_BY_COMPLAINANT_TYPE_PAST_12_MONTHS
            }
          />
          <br />
          <Visualization
            data-testid={"top10TagsGraph"}
            queryType={QUERY_TYPES.COUNT_TOP_10_TAGS}
          />
        </div>
      </div>
    );
  }
}

export default DataDashboard;
