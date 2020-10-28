import React from "react";
import {
  clearSelectedOfficer,
  selectOfficer,
  selectUnknownOfficer
} from "../../../actionCreators/officersActionCreators";
import LinkButton from "../../../shared/components/LinkButton";
import { Button } from "@material-ui/core";
import { SecondaryButton } from "../../../shared/components/StyledButtons";
import { Link } from "react-router-dom";
import StyledLink from "../../../shared/components/StyledLink";

export const SelectNewOfficer = ({ path, officer, initialize, dispatch }) => (
  <LinkButton
    data-testid="selectNewOfficerButton"
    component={Link}
    to={path}
    onClick={() => {
      dispatch(selectOfficer(officer));
      if (initialize) dispatch(initialize);
    }}
  >
    select
  </LinkButton>
);

export const SelectUnknownOfficerLink = ({ dispatch, initialize, path }) => (
  <StyledLink
    data-testid="selectUnknownOfficerLink"
    to={path}
    style={{ cursor: "pointer" }}
    onClick={() => {
      if (initialize) dispatch(initialize);
      dispatch(selectUnknownOfficer());
    }}
  >
    Add an Unknown Officer
  </StyledLink>
);

export const SelectUnknownOfficerButton = ({ dispatch, initialize, path }) => (
  <SecondaryButton
    style={{ marginRight: 20 }}
    data-testid="unknownOfficerButton"
    component={Link}
    to={path}
    onClick={() => {
      if (initialize) dispatch(initialize);
      dispatch(selectUnknownOfficer());
    }}
  >
    add an unknown officer
  </SecondaryButton>
);

export const PreviouslyAddedOfficer = () => (
  <Button disabled={true} data-testid="officerAlreadyAdded">
    added
  </Button>
);

export const ChangeOfficer = ({ children, dispatch, officerSearchUrl }) => (
  <LinkButton
    data-testid="changeOfficerLink"
    component={Link}
    to={officerSearchUrl}
    onClick={() => {
      dispatch(clearSelectedOfficer());
    }}
  >
    {children}
  </LinkButton>
);
