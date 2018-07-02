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
import { connect } from "react-redux";
import EditOfficerAllegationForm from "./EditOfficerAllegationForm";
import LinkButton from "../../shared/components/LinkButton";
import {
  closeEditAllegationForm,
  openEditAllegationForm,
  openRemoveOfficerAllegationDialog
} from "../../actionCreators/allegationsActionCreators";

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
      style={{
        marginRight: "32px"
      }}
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
            <Typography style={{ flex: 1, marginRight: "24px" }}>
              {formatStringToTitleCase(allegation.rule)}
            </Typography>
            <Typography style={{ flex: 1, marginRight: "24px" }}>
              {formatStringToTitleCase(allegation.paragraph)}
            </Typography>
            <Typography style={{ flex: 1, marginRight: "24px" }}>
              {allegation.directive
                ? formatStringToTitleCase(allegation.directive)
                : "N/A"}
            </Typography>
          </div>
          <div style={{ minWidth: "88px", paddingRight: "0px" }}>
            {editMode ? null : (
              <div>
                <LinkButton
                  data-test={"editAllegationButton"}
                  onClick={this.handleSubmit(id)}
                  style={{ flex: 1 }}
                >
                  Edit
                </LinkButton>
                <LinkButton
                  data-test={"removeAllegationButton"}
                  onClick={this.handleRemoveAllegation()}
                  style={{ flex: 1 }}
                >
                  Remove
                </LinkButton>
              </div>
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
          <div style={{ flex: "1" }} />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

const mapDispatchToProps = {
  openEditAllegationForm,
  closeEditAllegationForm,
  openRemoveOfficerAllegationDialog
};

const StyledComponent = withStyles(styles)(OfficerAllegationPanelForm);
export default connect(undefined, mapDispatchToProps)(StyledComponent);
