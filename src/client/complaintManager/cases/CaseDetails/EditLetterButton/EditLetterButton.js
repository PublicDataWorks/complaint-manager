import {
  CASE_STATUS,
  CASE_STATUSES_ALLOWED_TO_EDIT_LETTER
} from "../../../../../sharedUtilities/constants";
import { Link } from "react-router-dom";
import LinkButton from "../../../shared/components/LinkButton";
import React from "react";

const editLetterButtonText = status => {
  if (status === CASE_STATUS.LETTER_IN_PROGRESS) {
    return "Resume Letter";
  } else if (status === CASE_STATUS.READY_FOR_REVIEW) {
    return "Edit Letter";
  } else {
    return "Edit Letter Details";
  }
};
const EditLetterButton = ({ status, caseId }) => {
  if (CASE_STATUSES_ALLOWED_TO_EDIT_LETTER.includes(status)) {
    return (
      <LinkButton
        data-testid={"edit-letter-button"}
        to={`/cases/${caseId}/letter/review`}
        component={Link}
      >
        {editLetterButtonText(status)}
      </LinkButton>
    );
  } else return "";
};

export default EditLetterButton;
