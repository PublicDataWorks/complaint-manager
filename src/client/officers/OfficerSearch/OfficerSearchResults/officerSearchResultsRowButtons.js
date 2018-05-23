import React from "react";
import {
  clearSelectedOfficer,
  selectOfficer,
  selectUnknownOfficer
} from "../../../actionCreators/officersActionCreators";
import LinkButton from "../../../shared/components/LinkButton";
import { Button } from "material-ui";
import { SecondaryButton } from "../../../shared/components/StyledButtons";
import { Link } from "react-router-dom";

export const SelectNewOfficer = ({ path, officer, initialize, dispatch }) => (
  <LinkButton
    data-test="selectNewOfficerButton"
    component={Link}
    to={path}
    onClick={() => {
      dispatch(selectOfficer(officer));
      dispatch(initialize);
    }}
  >
    select
  </LinkButton>
);

export const SelectUnknownOfficerButton = ({ dispatch, initialize, path }) => (
  <SecondaryButton
    style={{ marginRight: 20 }}
    data-test="unknownOfficerButton"
    component={Link}
    to={path}
    onClick={() => {
      dispatch(initialize);
      dispatch(selectUnknownOfficer());
    }}
  >
    add an unknown officer
  </SecondaryButton>
);

export const PreviouslyAddedOfficer = () => (
  <Button disabled={true}>added</Button>
);

export const ChangeOfficer = ({ children, dispatch, officerSearchUrl }) => (
  <LinkButton
    data-test="changeOfficerLink"
    component={Link}
    to={officerSearchUrl}
    onClick={() => {
      dispatch(clearSelectedOfficer());
    }}
  >
    {children}
  </LinkButton>
);
