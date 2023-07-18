import React, { Component } from "react";
import { connect } from "react-redux";
import { CardContent, Accordion, AccordionSummary } from "@material-ui/core";
import formatStringToTitleCase from "../../../../utilities/formatStringToTitleCase";
import OfficerInfoDisplay from "./OfficerInfoDisplay";
import StyledExpansionPanelDetails from "../StyledExpansionPanelDetails";
import ExpansionPanelIconButton from "../../../../shared/components/ExpansionPanelIconButton";
import OfficerAllegationSummary from "../../../../allegations/OfficerAllegationSummary";

class OfficerAllegationDisplay extends Component {
  handleChange = (event, expanded) => {
    this.setState({
      expanded: expanded
    });
  };

  state = {
    expanded: false
  };

  static getDerivedStateFromProps(nextProps) {
    if (
      nextProps.accusedOfficerPanel &&
      nextProps.accusedOfficerPanel.collapsed
    ) {
      return {
        expanded: false
      };
    }

    return null;
  }

  render() {
    const { rule, paragraph, details, severity } = this.props;

    return (
      <CardContent
        style={{
          marginBottom: "16px",
          paddingTop: "0px",
          paddingBottom: "0px"
        }}
      >
        <Accordion
          elevation={5}
          onChange={this.handleChange}
          expanded={this.state.expanded}
          style={{
            width: "100%",
            background: "white",
            padding: "0"
          }}
        >
          <OfficerAllegationSummary
            canEdit={false}
            allegation={{ rule, paragraph }}
          />
          <StyledExpansionPanelDetails>
            <OfficerInfoDisplay
              shouldTruncate={false}
              displayLabel="Severity"
              value={severity}
              testLabel="allegationSeverity"
            />
          </StyledExpansionPanelDetails>
          <StyledExpansionPanelDetails>
            <OfficerInfoDisplay
              shouldTruncate={false}
              displayLabel="Notes"
              value={details}
              testLabel="allegationDetails"
            />
          </StyledExpansionPanelDetails>
        </Accordion>
      </CardContent>
    );
  }
}

const mapStateToProps = (state, { officerId }) => {
  return {
    accusedOfficerPanel: state.ui.accusedOfficerPanels[officerId]
  };
};

export default connect(mapStateToProps)(OfficerAllegationDisplay);
