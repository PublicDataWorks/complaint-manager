import { openCreateDialog } from "../../common/actionCreators/createDialogActionCreators";
import { PrimaryButton } from "../../shared/components/StyledButtons";
import { DialogTypes } from "../../common/actionCreators/dialogTypes";
import { connect } from "react-redux";
import React from "react";
import CreateMatrixDialog from "../createMatrixDialog/CreateMatrixDialog";

const CreateMatrixButton = ({ openCreateMatrixDialog, open }) => (
  <div>
    <PrimaryButton
      data-test="create-matrix-button"
      onClick={() => openCreateMatrixDialog(DialogTypes.MATRIX)}
      style={{ marginLeft: "5%", marginTop: "2%" }}
    >
      Create New Matrix
    </PrimaryButton>
    <CreateMatrixDialog open={open} />
  </div>
);

const mapDispatchToProps = {
  openCreateMatrixDialog: openCreateDialog
};

export default connect(
  null,
  mapDispatchToProps
)(CreateMatrixButton);
