import React, {Fragment} from "react";
import {ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Typography} from "@material-ui/core";
import TextTruncate from "../shared/components/TextTruncate";
import formatStringToTitleCase from "../utilities/formatStringToTitleCase";

const OfficerAllegations = props => {
  const { officerAllegations } = props;

  return (
    <Fragment>
      {officerAllegations.map((officerAllegation, index) => (
        <ExpansionPanel
          key={index}
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
            <div>
              <Typography variant="caption">Allegation Details</Typography>
              <TextTruncate message={officerAllegation.details} />
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
    </Fragment>
  );
};

export default OfficerAllegations;
