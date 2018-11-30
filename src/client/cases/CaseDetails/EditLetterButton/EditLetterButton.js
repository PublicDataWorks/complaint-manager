import {
  CASE_STATUS,
  CASE_STATUSES_ALLOWED_TO_EDIT_LETTER
} from "../../../../sharedUtilities/constants";
import { Link } from "react-router-dom";
import LinkButton from "../../../shared/components/LinkButton";
import React from "react";

const EditLetterButton = ({ status, caseId }) => {
  if (CASE_STATUSES_ALLOWED_TO_EDIT_LETTER.includes(status)) {
    return (
      <LinkButton
        data-test={"edit-letter-button"}
        to={`/cases/${caseId}/letter/review`}
        component={Link}
      >
        {status === CASE_STATUS.LETTER_IN_PROGRESS
          ? "Resume Letter"
          : "Edit Letter"}
      </LinkButton>
    );
  } else return "";
};

export default EditLetterButton;
