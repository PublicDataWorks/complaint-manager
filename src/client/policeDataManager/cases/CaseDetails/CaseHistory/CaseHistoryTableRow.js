import { dateTimeFromString } from "../../../../../sharedUtilities/formatDate";
import { TableCell, TableRow } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React from "react";
import tableStyleGenerator from "../../../../tableStyles";
import CaseHistoryDetails from "./CaseHistoryDetails";
import { userTimezone } from "./../../../../common/helpers/userTimezone";

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
        {dateTimeFromString(history.timestamp, userTimezone)}
      </TableCell>
    </TableRow>
  );
};

export default withStyles(styles, { withTheme: true })(CaseHistoryRow);
