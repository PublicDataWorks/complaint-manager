import React from "react";
import { connect } from "react-redux";
import { openCreateCaseDialog } from "../actionCreators/casesActionCreators";
import { PrimaryButton } from "../shared/components/StyledButtons";
import CreateCaseDialog from "./CreateCaseDialog/CreateCaseDialog";

const CreateCaseButton = ({ openCreateCaseDialog, open }) => (
  <div>
    <PrimaryButton
      data-test="createCaseButton"
      onClick={openCreateCaseDialog}
      style={{ marginLeft: "5%", marginTop: "2%" }}
    >
      Create New Case
    </PrimaryButton>
    <CreateCaseDialog open={open} />
  </div>
);

const mapDispatchToProps = {
  openCreateCaseDialog
};

export default connect(
  null,
  mapDispatchToProps
)(CreateCaseButton);
