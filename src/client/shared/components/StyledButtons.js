import { Button } from "@material-ui/core";
import React from "react";

export const SecondaryButton = ({ children, onClick, ...other }) => {
  return (
    <Button variant="raised" onClick={onClick} color="secondary" {...other}>
      {children}
    </Button>
  );
};

export const PrimaryButton = ({ children, onClick, ...other }) => {
  return (
    <Button
      variant="raised"
      onClick={onClick}
      type="submit"
      color="primary"
      {...other}
    >
      {children}
    </Button>
  );
};
