import formatStringToTitleCase from "../../utilities/formatStringToTitleCase";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Icon,
  IconButton,
  Typography
} from "@material-ui/core";
import OfficerInfoDisplay from "../../cases/CaseDetails/PersonOnCase/Officers/OfficerInfoDisplay";
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

const renderDetailsView = (details, severity) => {
  return (
    <div>
      <AccordionDetails>
        <OfficerInfoDisplay
          shouldTruncate={false}
          displayLabel="Severity"
          value={severity}
          style={{
            marginRight: "32px",
            marginLeft: "64px"
          }}
        />
      </AccordionDetails>
      <AccordionDetails>
        <OfficerInfoDisplay
          shouldTruncate={false}
          displayLabel="Allegation Details"
          value={details}
          style={{
            marginRight: "32px",
            marginLeft: "64px"
          }}
        />
      </AccordionDetails>
    </div>
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
      officerAllegation: { allegation, id, details, severity },
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
        <AccordionSummary style={{ display: "flex" }}>
          <IconButton
            style={{ marginRight: 16 }}
            color="secondary"
            className="chevron-right"
            disabled={editMode}
            data-testid="expandIcon"
          >
            <Icon>unfold_more</Icon>
          </IconButton>
          <div style={{ display: "flex", flex: 20 }}>
            <div style={{ flex: 1, marginRight: "24px" }}>
              <Typography variant="caption">Rule</Typography>
              <Typography>
                {formatStringToTitleCase(allegation.rule)}
              </Typography>
            </div>
            <div style={{ flex: "1", marginRight: "24px" }}>
              <Typography variant="caption">Paragraph</Typography>
              <Typography>
                {formatStringToTitleCase(allegation.paragraph)}
              </Typography>
            </div>
            <div style={{ flex: 1, marginRight: "24px" }}>
              <Typography variant="caption">Directive</Typography>
              <Typography>
                {allegation.directive
                  ? formatStringToTitleCase(allegation.directive)
                  : "N/A"}
              </Typography>
            </div>
          </div>
          <div style={{ minWidth: "189px", paddingRight: "0px" }}>
            {editMode ? null : (
              <div>
                <LinkButton
                  data-testid={"editAllegationButton"}
                  onClick={this.handleSubmit(id)}
                  style={{ flex: 1 }}
                >
                  Edit
                </LinkButton>
                <LinkButton
                  data-testid={"removeAllegationButton"}
                  onClick={this.handleRemoveAllegation()}
                  style={{ flex: 1 }}
                >
                  Remove
                </LinkButton>
              </div>
            )}
          </div>
        </AccordionSummary>
        {editMode ? (
          <EditOfficerAllegationForm
            form={`Allegation${id}DetailsForm`}
            initialValues={{ id, details, severity }}
            onCancel={this.handleCancel}
          />
        ) : (
          renderDetailsView(details, severity)
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
export default connect(undefined, mapDispatchToProps)(StyledComponent);
