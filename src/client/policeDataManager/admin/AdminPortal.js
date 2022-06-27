import React from "react";
import { connect } from "react-redux";
import { USER_PERMISSIONS } from "../../../sharedUtilities/constants";
import NavBar from "../shared/components/NavBar/NavBar";
import { policeDataManagerMenuOptions } from "../shared/components/NavBar/policeDataManagerMenuOptions";
import Signatures from "./Signatures";

const AdminPortal = ({ dispatch, permissions }) => {
  const checkPermissions = (...children) => {
    if (permissions.includes(USER_PERMISSIONS.ADMIN_ACCESS)) {
      return <article>{children}</article>;
    } else {
      return <div>Loading...</div>;
    }
  };

  return (
    <main className="admin-portal">
      <NavBar menuType={policeDataManagerMenuOptions}>Admin Portal</NavBar>
      {checkPermissions(<Signatures />)}
    </main>
  );
};

export default connect(state => ({
  permissions: state?.users?.current?.userInfo?.permissions
}))(AdminPortal);
