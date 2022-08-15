import React from "react";
import OfficerAllegationPanelForm from "./EditAllegationPanelForm/OfficerAllegationPanelForm";
import { connect } from "react-redux";
import {
  closeEditAllegationForm,
  closeRemoveOfficerAllegationDialog,
  openEditAllegationForm
} from "../actionCreators/allegationsActionCreators";
import RemoveOfficerAllegationDialog from "./RemoveOfficerAllegationDialog";

class OfficerAllegations extends React.Component {
  componentWillUnmount() {
    this.props.closeRemoveOfficerAllegationDialog();
  }

  render() {
    const { officerAllegations, editAllegationForms } = this.props;

    return (
      <div>
        {officerAllegations.map((officerAllegation, index) => (
          <OfficerAllegationPanelForm
            editAllegationFormState={editAllegationForms[officerAllegation.id]}
            key={officerAllegation.id}
            index={index}
            officerAllegation={officerAllegation}
          />
        ))}
        <RemoveOfficerAllegationDialog />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  editAllegationForms: state.ui.editAllegationForms
});

const mapDispatchToProps = {
  openEditAllegationForm,
  closeEditAllegationForm,
  closeRemoveOfficerAllegationDialog
};

export default connect(mapStateToProps, mapDispatchToProps)(OfficerAllegations);
