import React, { Component } from "react";
import NavBar from "../shared/components/NavBar/NavBar";
import { connect } from "react-redux";
import { closeSnackbar } from "../actionCreators/snackBarActionCreators";
import AllExports from "./AllExports";
import { policeDataManagerMenuOptions } from "../shared/components/NavBar/policeDataManagerMenuOptions";

class JobDashboard extends Component {
  componentDidMount() {
    this.props.dispatch(closeSnackbar());
  }

  render() {
    return (
      <div>
        <NavBar menuType={policeDataManagerMenuOptions}>Data Export</NavBar>
        <AllExports />
      </div>
    );
  }
}

export default connect()(JobDashboard);
