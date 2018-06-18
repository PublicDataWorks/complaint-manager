import React, { Fragment } from "react";
import Allegation from "./Allegation";
import tableStyleGenerator from "../tableStyles";
import { withStyles } from "@material-ui/core/styles";
import { TableRow } from "@material-ui/core";

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
          <Allegation allegation={officerAllegation.allegation} />
        </TableRow>
      ))}
    </Fragment>
  );
};

export default withStyles(styles, { withTheme: true })(OfficerAllegations);
