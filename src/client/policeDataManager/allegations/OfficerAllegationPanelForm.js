import { Accordion, AccordionDetails } from "@material-ui/core";
import OfficerInfoDisplay from "../cases/CaseDetails/PersonOnCase/Officers/OfficerInfoDisplay";
import { withStyles } from "@material-ui/core/styles/index";
import React from "react";
import { connect } from "react-redux";
import {
  closeEditAllegationForm,
  openEditAllegationForm,
  openRemoveOfficerAllegationDialog
} from "../actionCreators/allegationsActionCreators";
import AllegationDetailsForm from "./AllegationDetailsForm";
import editOfficerAllegation from "../cases/thunks/editOfficerAllegation";
import OfficerAllegationSummary from "./OfficerAllegationSummary";
import OfficerAllegationExpansionPanel from "./OfficerAllegationExpansionPanel";

const styles = {
  root: {
    "&:before": {
      height: 0
    }
  }
};

class OfficerAllegationPanelForm extends React.Component {
  state = {
    expanded: false
  };

  handleChange = editMode => (event, expanded) => {
    this.setState({ expanded: editMode || expanded });
  };

  handleCancel = () => {
    this.props.closeEditAllegationForm(this.props.officerAllegation.id);
    this.setState({ expanded: true });
  };

  handleSubmit = id => e => {
    e.stopPropagation();
    this.props.openEditAllegationForm(id);
    this.setState({ expanded: true });
  };

  handleRemoveAllegation = () => e => {
    e.stopPropagation();
    this.props.openRemoveOfficerAllegationDialog(this.props.officerAllegation);
  };

  componentWillUnmount() {
    this.setState({ expanded: false });
    this.props.closeEditAllegationForm(this.props.officerAllegation.id);
  }

  render() {
    const {
      officerAllegation: {
        allegation,
        id,
        details,
        severity,
        ruleChapter,
        directive,
        customDirective
      },
      editAllegationFormState,
      index,
      classes
    } = this.props;
    const editMode =
      editAllegationFormState && editAllegationFormState.editMode;

    return (
      <Accordion
        classes={{ root: classes.root }}
        data-testid={`officerAllegation${index}`}
        elevation={0}
        onChange={this.handleChange(editMode)}
        expanded={editMode || this.state.expanded}
        style={{
          backgroundColor: "white",
          width: "95%",
          marginBottom: "8px",
          padding: "8px",
          marginLeft: "auto"
        }}
      >
        <OfficerAllegationSummary
          canEdit={true}
          editMode={editMode}
          allegation={allegation}
          handleSubmit={() => this.handleSubmit(id)}
          handleRemoveAllegation={this.handleRemoveAllegation.bind(this)}
        />
        {editMode ? (
          <AccordionDetails>
            <div style={{ width: "100%", marginLeft: "64px" }}>
              <AllegationDetailsForm
                allegationDetailsLabel="Allegation Details"
                form={`Allegation${id}DetailsForm`}
                initialValues={{
                  id,
                  details,
                  severity,
                  ruleChapter: ruleChapter
                    ? {
                        label: ruleChapter.name,
                        value: ruleChapter.id
                      }
                    : undefined,
                  directive: directive
                    ? {
                        label: directive.name,
                        value: directive.id
                      }
                    : customDirective
                    ? {
                        label: customDirective,
                        value: customDirective
                      }
                    : undefined
                }}
                marginBottomOffset={32}
                onCancel={this.handleCancel}
                onSubmit={(values, dispatch) => {
                  const {
                    id,
                    details,
                    severity,
                    ruleChapter,
                    directive,
                    customDirective
                  } = values;
                  dispatch(
                    editOfficerAllegation(
                      {
                        id,
                        details,
                        severity,
                        ruleChapter,
                        directive,
                        customDirective
                      },
                      this.props.caseId
                    )
                  );
                }}
                submitButtonText="Save"
              />
            </div>
          </AccordionDetails>
        ) : (
          <OfficerAllegationExpansionPanel
            details={details}
            severity={severity}
            ruleChapter={ruleChapter}
            directive={directive}
            customDirective={customDirective}
          />
        )}
        <div style={{ flex: "1" }} />
      </Accordion>
    );
  }
}

const mapDispatchToProps = {
  openEditAllegationForm,
  closeEditAllegationForm,
  openRemoveOfficerAllegationDialog
};

const StyledComponent = withStyles(styles)(OfficerAllegationPanelForm);
export default connect(
  state => ({ caseId: state.currentCase.details.id }),
  mapDispatchToProps
)(StyledComponent);
