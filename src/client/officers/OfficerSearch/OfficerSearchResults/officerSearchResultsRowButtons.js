import React from "react";
import {
  clearSelectedOfficer,
  selectOfficer,
  selectUnknownOfficer
} from "../../../actionCreators/officersActionCreators";
import LinkButton from "../../../sharedComponents/LinkButton";
import { Button } from "material-ui";
import { SecondaryButton } from "../../../sharedComponents/StyledButtons";
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
    component={Link}
    to={officerSearchUrl}
    onClick={() => {
      dispatch(clearSelectedOfficer());
    }}
  >
    {children}
  </LinkButton>
);
