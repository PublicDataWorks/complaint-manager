import React, { useEffect } from "react";
import { connect } from "react-redux";
import { USER_PERMISSIONS } from "../../../sharedUtilities/constants";
import NavBar from "../shared/components/NavBar/NavBar";
import { policeDataManagerMenuOptions } from "../shared/components/NavBar/policeDataManagerMenuOptions";
import Signatures from "./signatures/Signatures";
import LetterTypes from "./letterTypes/LetterTypes";
import getSigners from "./thunks/getSigners";
import getCaseStatuses from "../cases/thunks/getCaseStatuses";

const AdminPortal = ({
  permissions,
  getCaseStatuses,
  getSigners,
  thisIsATest
}) => {
  useEffect(() => {
    getSigners();
    getCaseStatuses();
  }, []);

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
      {checkPermissions(
        <Signatures key="signatures" thisIsATest={thisIsATest} />
      )}
      {checkPermissions(<LetterTypes key="letterTypes" />)}
    </main>
  );
};

export default connect(
  state => ({
    permissions: state?.users?.current?.userInfo?.permissions
  }),
  { getSigners, getCaseStatuses }
)(AdminPortal);
