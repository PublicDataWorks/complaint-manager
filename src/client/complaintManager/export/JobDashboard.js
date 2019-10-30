import React, { Component } from "react";
import NavBar from "../shared/components/NavBar/NavBar";
import { connect } from "react-redux";
import { closeSnackbar } from "../actionCreators/snackBarActionCreators";
import AllExports from "./AllExports";
import { complaintManagerMenuOptions } from "../shared/components/NavBar/complaintManagerMenuOptions";

class JobDashboard extends Component {
  componentDidMount() {
    this.props.dispatch(closeSnackbar());
  }

  render() {
    return (
      <div>
        <NavBar menuType={complaintManagerMenuOptions}>Data Export</NavBar>
        <AllExports />
      </div>
    );
  }
}

export default connect()(JobDashboard);
