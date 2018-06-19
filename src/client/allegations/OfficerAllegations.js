import React, { Fragment } from "react";
import Allegation from "./Allegation";
import tableStyleGenerator from "../tableStyles";
import { withStyles } from "@material-ui/core/styles";
import {
  TableRow,
  ExpansionPanel,
  ExpansionPanelSummary,
  Typography
} from "@material-ui/core";
import StyledExpansionPanelDetails from "../cases/CaseDetails/ComplainantWitnesses/StyledExpansionPanelDetails";
import TextTruncate from "../shared/components/TextTruncate";

const styles = theme => ({
  ...tableStyleGenerator(theme).body
});

const OfficerAllegations = props => {
  const { classes, officerAllegations } = props;
  const primaryRowClasses = `${classes.row} ${classes.noBorderBottom}`;

  return (
    <Fragment>
      {officerAllegations.map(officerAllegation => (
        <TableRow className={primaryRowClasses} key={officerAllegation.id}>
          <ExpansionPanel elevation={0} style={{ backgroundColor: "white" }}>
            <ExpansionPanelSummary
              style={{
                padding: "0px 24px"
              }}
            >
              <Allegation allegation={officerAllegation.allegation} />
            </ExpansionPanelSummary>
            <StyledExpansionPanelDetails>
              <div
                style={{
                  flex: 1,
                  textAlign: "left",
                  marginRight: "10px",
                  padding: "0px 24px"
                }}
              >
                <Typography variant="caption">Allegation Details</Typography>
                <Typography variant="body1" style={{ whiteSpace: "pre-wrap" }}>
                  <TextTruncate message={officerAllegation.details} />
                </Typography>
              </div>
            </StyledExpansionPanelDetails>
          </ExpansionPanel>
        </TableRow>
      ))}
    </Fragment>
  );
};

export default withStyles(styles, { withTheme: true })(OfficerAllegations);
