import React, { Fragment } from "react";
import OfficerAllegationPanelForm from "./EditAllegationPanelForm/OfficerAllegationPanelForm";
import { connect } from "react-redux";
import {
  closeEditAllegationForm,
  openEditAllegationForm
} from "../actionCreators/allegationsActionCreators";

const OfficerAllegations = props => {
  const {
    officerAllegations,
    editAllegationForms,
    closeEditAllegationForm,
    openEditAllegationForm
  } = props;

  return (
    <Fragment>
      {officerAllegations.map((officerAllegation, index) => (
        <OfficerAllegationPanelForm
          editAllegationFormState={editAllegationForms[officerAllegation.id]}
          openEditAllegationForm={openEditAllegationForm}
          closeEditAllegationForm={closeEditAllegationForm}
          key={officerAllegation.id}
          index={index}
          officerAllegation={officerAllegation}
        />
      ))}
    </Fragment>
  );
};

const mapStateToProps = state => ({
  editAllegationForms: state.ui.editAllegationForms
});

const mapDispatchToProps = {
  openEditAllegationForm,
  closeEditAllegationForm
};

export default connect(mapStateToProps, mapDispatchToProps)(OfficerAllegations);
