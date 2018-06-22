import React, {Component} from "react";
import formatStringToTitleCase from "../../../utilities/formatStringToTitleCase";
import OfficerInfoDisplay from "./OfficerInfoDisplay";
import StyledExpansionPanelDetails from "../ComplainantWitnesses/StyledExpansionPanelDetails";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  CardContent
} from "@material-ui/core";
import { connect } from "react-redux";

class OfficerAllegationDisplay extends Component {
  handleChange = (event, expanded) => {
    this.setState({
      expanded: expanded
    })
  }

  state = {
    expanded: false
  }

  static getDerivedStateFromProps(nextProps){
    if (nextProps.accusedOfficerPanel && nextProps.accusedOfficerPanel.collapsed){
      return {
        expanded: false
      }
    }

    return null
  }

  render(){
    const {
      rule,
      paragraph,
      directive,
      details} = this.props;

    return (
      <CardContent
        style={{ marginBottom: "16px", paddingTop: "0px", paddingBottom: "0px" }}
      >
        <ExpansionPanel
          elevation={5}
          onChange={this.handleChange }
          expanded={ this.state.expanded}
          style={{
            width: "100%",
            background: "white",
            padding: "0",
            marginRight: "190px"
          }}
        >
          <ExpansionPanelSummary>
            <OfficerInfoDisplay
              displayLabel="Rule"
              value={formatStringToTitleCase(rule)}
              testLabel="rule"
            />
            <OfficerInfoDisplay
              displayLabel="Paragraph"
              value={formatStringToTitleCase(paragraph)}
              testLabel="paragraph"
            />
            <OfficerInfoDisplay
              displayLabel="Directive"
              value={formatStringToTitleCase(directive)}
              testLabel="directive"
            />
          </ExpansionPanelSummary>
          <StyledExpansionPanelDetails>
            <OfficerInfoDisplay
              shouldTruncate={false}
              displayLabel="Notes"
              value={details}
              testLabel="allegationDetails"
            />
          </StyledExpansionPanelDetails>
        </ExpansionPanel>
      </CardContent>
    );
  }
}

const mapStateToProps = (state, {officerId}) => {
  return {
    accusedOfficerPanel: state.ui.accusedOfficerPanels[officerId]
  };
};

export default connect(mapStateToProps)(OfficerAllegationDisplay);
