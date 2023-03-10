import React, { useState, useEffect } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import EditLetter from "./EditLetter";
import { snackbarSuccess } from "../../../actionCreators/snackBarActionCreators";

const EditGeneralLetter = props => {
  const [letter, setLetter] = useState();
  const letterBaseApiRoute = `/api/cases/${props.match.params.id}/letters/${props.match.params.letterId}`;

  useEffect(() => {
    axios.get(`${letterBaseApiRoute}/preview`).then(response => {
      setLetter(response.data);
    });
  }, []);

  const editContent = async (value, redirectUrl) => {
    try {
      const response = await axios.put(
        `${letterBaseApiRoute}/content`,
        JSON.stringify(value)
      );
      setLetter(response.data);
      props.dispatch(push(redirectUrl));
      props.dispatch(snackbarSuccess("Letter was successfully updated"));
    } catch (error) {}
  };

  return (
    <>
      {letter && (
        <EditLetter
          caseId={props.match.params.id}
          letterPreviewEndpoint={`${props.match.params.letterId}/letter-preview`}
          editContent={editContent}
          editLetterEndpoint={`letter/${props.match.params.letterId}/edit-letter`}
          letterHtml={letter?.letterHtml}
          setInitialValues={() => {}}
          initialValues={{ editedLetterHtml: letter.letterHtml }}
          isCaseStatusValid={() => true}
          useLetterProgressStepper={false}
          caseReference={letter?.caseDetails?.caseReference}
        />
      )}
    </>
  );
};

export default connect()(EditGeneralLetter);
