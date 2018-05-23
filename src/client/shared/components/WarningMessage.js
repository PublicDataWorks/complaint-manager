import React from "react";
import ReportProblemIcon from "@material-ui/icons/ReportProblem";
import { withStyles } from "material-ui";

const styles = theme => ({
  warnIcon: {
    color: theme.palette.yellow,
    margin: "0px 5px 0px 0px",
    height: 20,
    width: 20
  },
  messageContainer: {
    display: "flex",
    alignItems: "center"
  },
  tableCell: {
    color: theme.palette.secondary.light
  }
});

const WarningMessage = ({ classes, children, variant }) => {
  const classesToApply =
    variant === "tableCell"
      ? [classes.messageContainer, classes.tableCell].join(" ")
      : classes.messageContainer;

  return (
    <div className={classesToApply}>
      {variant === "tableCell" ? null : (
        <ReportProblemIcon data-test="warnIcon" className={classes.warnIcon} />
      )}
      <em className={classes.text}>{children}</em>
    </div>
  );
};

export default withStyles(styles, { withTheme: true })(WarningMessage);
