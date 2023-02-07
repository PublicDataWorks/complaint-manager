import React, { useState, useEffect } from "react";
import axios from "axios";
import LetterPreview, { SUBMIT_BUTTON_TYPE } from "./LetterPreview";

const GeneralLetterPreview = props => {
  const [letter, setLetter] = useState();
  const letterBaseApiRoute = `api/cases/${props.match.params.id}/letters/${props.match.params.letterId}`;

  useEffect(() => {
    axios
      .get(`${letterBaseApiRoute}/preview`)
      .then(response => {
        setLetter(response.data);
      })
      .catch(err => {});
  }, []);

  return (
    <LetterPreview
      addresses={letter?.addresses}
      caseId={props.match.params.id}
      draftFilename={letter?.draftFilename}
      editAddressUrl={`${letterBaseApiRoute}/addresses`}
      editStatus={letter?.editStatus}
      getPdfEndpoint={`letters/${props.match.params.letterId}/pdf`}
      editLetterEndpoint={`letter/${props.match.params.letterId}/edit-letter`}
      lastEdited={letter?.lastEdited}
      letterHtml={letter?.letterHtml}
      submitButtonType={SUBMIT_BUTTON_TYPE.GENERATE_LETTER_BTN}
    />
  );
};

export default GeneralLetterPreview;
