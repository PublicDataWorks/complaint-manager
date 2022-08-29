import React, { Component } from "react";
import NavBar from "../shared/components/NavBar/NavBar";
import { connect } from "react-redux";
import { USER_PERMISSIONS } from "../../../sharedUtilities/constants";
import { closeSnackbar } from "../actionCreators/snackBarActionCreators";
import AllExports from "./AllExports";
import { policeDataManagerMenuOptions } from "../shared/components/NavBar/policeDataManagerMenuOptions";

const JobDashboard = ({ permissions }) => {
  const checkPermissions = (...children) => {
    if (permissions.includes(USER_PERMISSIONS.EDIT_CASE)) {
      return <article>{children}</article>;
    } else {
      return <div>Loading...</div>;
    }
  };

  // componentDidMount() {
  //   this.props.dispatch(closeSnackbar());
  // }

  return (
    <main className="job-dashboard">
      <NavBar menuType={policeDataManagerMenuOptions}>Data Export</NavBar>
      {checkPermissions(<AllExports key="allExports" />)}
    </main>
  );
};
export default connect(state => ({
  permissions: state?.users?.current?.userInfo?.permissions
}))(JobDashboard);
