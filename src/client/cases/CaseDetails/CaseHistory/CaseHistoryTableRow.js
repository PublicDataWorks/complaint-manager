import { dateTimeFromString } from "../../../utilities/formatDate";
import { TableCell, TableRow, withStyles } from "material-ui";
import React from "react";
import tableStyleGenerator from "../../../tableStyles";
import CaseHistoryDetails from "./CaseHistoryDetails";

const styles = theme => ({
  ...tableStyleGenerator(theme).body
});

const CaseHistoryRow = ({ classes, history }) => {
  return (
    <TableRow className={classes.row} key={history.id}>
      <TableCell className={classes.topAlignCell}>{history.user}</TableCell>
      <TableCell className={classes.topAlignCell}>{history.action}</TableCell>
      <TableCell className={classes.topAlignCell}>
        <CaseHistoryDetails
          details={history.details}
          action={history.action}
          modelDescription={history.modelDescription}
        />
      </TableCell>
      <TableCell className={classes.topAlignCell}>
        {dateTimeFromString(history.timestamp)}
      </TableCell>
    </TableRow>
  );
};

export default withStyles(styles, { withTheme: true })(CaseHistoryRow);
