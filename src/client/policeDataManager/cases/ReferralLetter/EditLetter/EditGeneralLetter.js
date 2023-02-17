import React, { useState, useEffect } from "react";
import axios from "axios";
import EditLetter from "./EditLetter";
import history from "../../../../history";
import { snackbarSuccess } from "../../../actionCreators/snackBarActionCreators";

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
      const response = await axios.put(
        `${letterBaseApiRoute}/content`,
        JSON.stringify(value)
      );
      setLetter(response.data);
      history.push(redirectUrl);
    } catch (error) {}
    snackbarSuccess("Letter was successfully updated");
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
