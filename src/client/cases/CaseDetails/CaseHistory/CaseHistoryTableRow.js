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
  const longFieldLength = 50;
  return Object.keys(details).map((field, index) => {
    if (
      details[field]["previous"].length > longFieldLength ||
      details[field]["new"].length > longFieldLength
    ) {
      return renderLongHistoryDetails(field, details, index);
    }
    return renderShortHistoryDetails(field, details, index);
  });
};

const renderLongHistoryDetails = (field, details, index) => {
  return (
    <div key={index}>
      <div>{field} changed</div>
      <div style={{ paddingLeft: "16px" }}>
        <strong>from</strong> '{details[field]["previous"]}'
      </div>
      <div style={{ paddingLeft: "16px" }}>
        <strong>to</strong> '{details[field]["new"]}'
      </div>
    </div>
  );
};

const renderShortHistoryDetails = (field, details, index) => {
  return (
    <div key={index}>
      {field} changed <strong>from</strong> '{details[field]["previous"]}'{" "}
      <strong>to</strong> '{details[field]["new"]}'
    </div>
  );
};

export default withStyles(styles, { withTheme: true })(CaseHistoryRow);
