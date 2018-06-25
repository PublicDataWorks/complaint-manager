import React, {Fragment} from "react";
import {ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Typography} from "@material-ui/core";
import formatStringToTitleCase from "../utilities/formatStringToTitleCase";
import OfficerInfoDisplay from "../cases/CaseDetails/Officers/OfficerInfoDisplay";
import { withStyles } from "@material-ui/core/styles";

const styles = ({
  root: {
    "&:before": {
      height: 0,
    }
  }
});

const OfficerAllegations = props => {
  const { officerAllegations } = props;

  return (
    <Fragment>
      {officerAllegations.map((officerAllegation, index) => (
        <ExpansionPanel
          key={index}
          classes={{
            root: props.classes.root
          }}
          data-test={`officerAllegation${index}`}
          elevation={0}
          style={{
            backgroundColor: "white",
            width: "95%",
            marginBottom: "8px",
            padding: "8px",
            marginLeft: 'auto'
          }}
        >
          <ExpansionPanelSummary style={{display: 'flex'}}>
            <Typography style={{flex: 1}}>
              {formatStringToTitleCase(officerAllegation.allegation.rule)}
            </Typography>
            <Typography style={{flex: 1}}>
              {formatStringToTitleCase(officerAllegation.allegation.paragraph)}
            </Typography>
            <Typography style={{flex: 1}}>
              {officerAllegation.allegation.directive
                ? formatStringToTitleCase(
                    officerAllegation.allegation.directive
                  )
                : "N/A"}
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <OfficerInfoDisplay
            shouldTruncate={false}
            displayLabel="Allegation Details"
            value={officerAllegation.details}
          />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
    </Fragment>
  );
};

export default withStyles(styles)(OfficerAllegations);
