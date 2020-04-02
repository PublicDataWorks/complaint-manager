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
        <Visualization
          data-testid={"dataVisualization"}
          queryType={QUERY_TYPES.COUNT_COMPLAINTS_BY_INTAKE_SOURCE}
        />
      </div>
    );
  }
}

export default DataDashboard;
