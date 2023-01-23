import React, { useState, useEffect } from "react";
import axios from "axios";
import LetterPreview from "./LetterPreview";

const GeneralLetterPreview = props => {
  const [letter, setLetter] = useState();

  useEffect(() => {
    axios
      .get(
        `api/cases/${props.match.params.id}/letter/${props.match.params.letterId}/preview`
      )
      .then(response => setLetter(response.data));
  }, []);

  return (
    <LetterPreview
      addresses={letter?.addresses}
      caseId={props.match.params.id}
      draftFilename={letter?.draftFilename}
      editStatus={letter?.editStatus}
      lastEdited={letter?.lastEdited}
      letterHtml={letter?.letterHtml}
    />
  );
};

export default GeneralLetterPreview;
