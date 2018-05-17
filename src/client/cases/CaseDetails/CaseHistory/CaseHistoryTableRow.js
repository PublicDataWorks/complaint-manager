import { dateTimeFromString } from "../../../utilities/formatDate";
import { TableCell, TableRow, withStyles } from "material-ui";
import React from "react";
import tableStyleGenerator from "../../../tableStyles";

const styles = theme => ({
  ...tableStyleGenerator(theme).body
});

const CaseHistoryRow = ({ classes, history }) => {
  return (
    <TableRow className={classes.row} key={history.id}>
      <TableCell className={classes.topAlignCell}>{history.user}</TableCell>
      <TableCell className={classes.topAlignCell}>{history.action}</TableCell>
      <TableCell className={classes.topAlignCell}>
        {renderHistoryDetails(history.details)}
      </TableCell>
      <TableCell className={classes.topAlignCell}>
        {dateTimeFromString(history.timestamp)}
      </TableCell>
    </TableRow>
  );
};

const renderHistoryDetails = details => {
  return details.map((detail, index) => {
    return <div key={index}>{detail}</div>;
  });
};

export default withStyles(styles, { withTheme: true })(CaseHistoryRow);
