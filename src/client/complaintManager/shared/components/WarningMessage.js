import React from "react";
import ReportProblemIcon from "@material-ui/icons/ReportProblem";
import { withStyles } from "@material-ui/core/styles";

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
  grayText: {
    color: theme.palette.secondary.light
  }
});

const WarningMessage = ({ classes, children, variant, style }) => {
  const classesToApply =
    variant === "grayText"
      ? [classes.messageContainer, classes.grayText].join(" ")
      : classes.messageContainer;

  return (
    <div className={classesToApply} style={style}>
      {variant === "grayText" ? null : (
        <ReportProblemIcon data-test="warnIcon" className={classes.warnIcon} />
      )}
      <em className={classes.text}>{children}</em>
    </div>
  );
};

export default withStyles(styles, { withTheme: true })(WarningMessage);
