import React, { useState, useEffect } from "react";
import axios from "axios";
import EditLetter from "./EditLetter";
import { push } from "connected-react-router";
import history from "../../../../history";

const EditGeneralLetter = props => {
  const [letter, setLetter] = useState();
  const letterBaseApiRoute = `api/cases/${props.match.params.id}/letters/${props.match.params.letterId}`;

  useEffect(() => {
    axios.get(`${letterBaseApiRoute}/preview`).then(response => {
      setLetter(response.data);
    });
  }, []);

  const setInitialValues = () => {
    return letter.letterHtml;
  };

  const invalidCaseStatus = () => {
    return false;
  };

  const updateLetter = async (value, redirectUrl) => {
    try {
      const myJSON = JSON.stringify(value);
      const response = await axios.put(`${letterBaseApiRoute}/content`, myJSON);
      setLetter(response.data);
      console.log("edited letter html", letter.editedLetterHtml);
      history.push(redirectUrl);
    } catch (error) {
      console.log("Error in try/catch", error);
    }
    // snackbarSuccess("Letter was successfully updated");
  };

  return (
    <>
      {letter && (
        <EditLetter
          caseId={props.match.params.id}
          letterPreviewEndpoint={`${props.match.params.letterId}/letter-preview`}
          editContent={updateLetter}
          editLetterEndpoint={`letter/${props.match.params.letterId}/edit-letter`}
          // getLetterPreview={() => getLetterPreview()}
          letter={letter}
          setInitialValues={() => setInitialValues()}
          initialValues={{ editedLetterHtml: letter.letterHtml }}
          checkCaseStatus={() => invalidCaseStatus()}
        />
      )}
    </>
  );
};

export default EditGeneralLetter;
