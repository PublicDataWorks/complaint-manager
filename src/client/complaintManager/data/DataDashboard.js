import React, { Component } from "react";
import NavBar from "../shared/components/NavBar/NavBar";
import { complaintManagerMenuOptions } from "../shared/components/NavBar/complaintManagerMenuOptions";

class DataDashboard extends Component {
  render() {
    return (
      <div>
        <NavBar menuType={complaintManagerMenuOptions}>Data Dashboard</NavBar>
      </div>
    );
  }
}

export default DataDashboard;
