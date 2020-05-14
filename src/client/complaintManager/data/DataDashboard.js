import React, { Component } from "react";
import NavBar from "../shared/components/NavBar/NavBar";
import { complaintManagerMenuOptions } from "../shared/components/NavBar/complaintManagerMenuOptions";
import Visualization from "../../common/components/Visualization/Visualization";
import { QUERY_TYPES } from "../../../sharedUtilities/constants";

class DataDashboard extends Component {
  render() {
    return (
      <div>
        <NavBar menuType={complaintManagerMenuOptions}>Data Dashboard</NavBar>
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
        </div>
      </div>
    );
  }
}

export default DataDashboard;
