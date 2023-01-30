import React, { useState, useEffect } from "react";
import axios from "axios";
import LetterPreview from "./LetterPreview";

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
      lastEdited={letter?.lastEdited}
      letterHtml={letter?.letterHtml}
    />
  );
};

export default GeneralLetterPreview;
