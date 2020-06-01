import React from "react";
import { IconButton, Snackbar } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";

const styleSheet = theme => ({
  error: {
    background: theme.palette.error.main
  },
  success: {
    background: theme.palette.green
  }
});

const SharedSnackbar = props => {
  const autoHideValue = props.success ? 4000 : 15000;
  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={props.open}
        autoHideDuration={autoHideValue}
        onClose={() => {
          props.closeSnackbar();
        }}
        ContentProps={{
          classes: {
            root: props.success ? props.classes.success : props.classes.error
          },
          style: { maxWidth: "800px" }
        }}
        message={
          <span data-testid="sharedSnackbarBannerText">{props.message}</span>
        }
        action={[
          <IconButton
            data-testid="closeSnackbar"
            key={"closeSnackbar"}
            onClick={() => props.closeSnackbar()}
            color="inherit"
          >
            <CloseIcon />
          </IconButton>
        ]}
      />
    </div>
  );
};

SharedSnackbar.defaultProps = {
  message: "",
  success: false,
  open: false
};

export default withStyles(styleSheet, { withTheme: true })(SharedSnackbar);
