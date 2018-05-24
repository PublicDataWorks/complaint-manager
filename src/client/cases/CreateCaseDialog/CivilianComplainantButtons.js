import React from "react";
import LinkButton from "../../shared/components/LinkButton";
import { PrimaryButton } from "../../shared/components/StyledButtons";

const CivilianComplainantButtons = props => (
  <div>
    <LinkButton
      data-test="createCaseOnly"
      onClick={props.createCaseOnly}
      style={{ marginRight: "10px" }}
    >
      Create Only
    </LinkButton>
    <PrimaryButton data-test="createAndView" onClick={props.createAndView}>
      Create And View
    </PrimaryButton>
  </div>
);

export default CivilianComplainantButtons;
