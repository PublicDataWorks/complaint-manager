import React from "react";
import { connect } from "react-redux";
import { openCreateDialog } from "../../common/actionCreators/createDialogActionCreators";
import { PrimaryButton } from "../shared/components/StyledButtons";
import CreateCaseDialog from "./CreateCaseDialog/CreateCaseDialog";
import { DialogTypes } from "../../common/actionCreators/dialogTypes";

const CreateCaseButton = ({ openCreateCaseDialog, open }) => (
  <div>
    <PrimaryButton
      data-testid="createCaseButton"
      onClick={() => openCreateCaseDialog(DialogTypes.CASE)}
      style={{ marginLeft: "5%", marginTop: "1%" }}
    >
      Create New Case
    </PrimaryButton>
    <CreateCaseDialog open={open} />
  </div>
);

const mapDispatchToProps = {
  openCreateCaseDialog: openCreateDialog
};

export default connect(null, mapDispatchToProps)(CreateCaseButton);
