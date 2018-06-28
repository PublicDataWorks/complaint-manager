import formatStringToTitleCase from "../../utilities/formatStringToTitleCase";
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Typography
} from "@material-ui/core";
import OfficerInfoDisplay from "../../cases/CaseDetails/Officers/OfficerInfoDisplay";
import { withStyles } from "@material-ui/core/styles/index";
import React from "react";
import EditOfficerAllegationForm from "./EditOfficerAllegationForm";
import LinkButton from "../../shared/components/LinkButton";

const styles = {
  root: {
    "&:before": {
      height: 0
    }
  }
};

const renderDetailsView = details => {
  return (
    <OfficerInfoDisplay
      shouldTruncate={false}
      displayLabel="Allegation Details"
      value={details}
    />
  );
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

  componentWillUnmount() {
    this.setState({ expanded: false });
    this.props.closeEditAllegationForm(this.props.officerAllegation.id);
  }

  render() {
    const {
      officerAllegation: { allegation, id, details },
      editAllegationFormState,
      index,
      classes
    } = this.props;
    const editMode =
      editAllegationFormState && editAllegationFormState.editMode;

    return (
      <ExpansionPanel
        classes={{ root: classes.root }}
        data-test={`officerAllegation${index}`}
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
        <ExpansionPanelSummary style={{ display: "flex" }}>
          <div style={{ display: "flex", flex: 20 }}>
            <Typography style={{ flex: 1 }}>
              {formatStringToTitleCase(allegation.rule)}
            </Typography>
            <Typography style={{ flex: 1 }}>
              {formatStringToTitleCase(allegation.paragraph)}
            </Typography>
            <Typography style={{ flex: 1 }}>
              {allegation.directive
                ? formatStringToTitleCase(allegation.directive)
                : "N/A"}
            </Typography>
          </div>
          <div style={{ flex: 1, minWidth: "88px" }}>
            {editMode ? null : (
              <LinkButton
                data-test={"editAllegationButton"}
                onClick={this.handleSubmit(id)}
              >
                Edit
              </LinkButton>
            )}
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          {editMode ? (
            <EditOfficerAllegationForm
              form={`Allegation${index}DetailsForm`}
              initialValues={{ id, details }}
              onCancel={this.handleCancel}
            />
          ) : (
            renderDetailsView(details)
          )}
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

export default withStyles(styles)(OfficerAllegationPanelForm);
