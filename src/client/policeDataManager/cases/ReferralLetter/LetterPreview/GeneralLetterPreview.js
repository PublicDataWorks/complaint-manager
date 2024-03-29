import React, { useState, useEffect } from "react";
import axios from "axios";
import LetterPreview, { SUBMIT_BUTTON_TYPE } from "./LetterPreview";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { snackbarSuccess } from "../../../actionCreators/snackBarActionCreators";

const GeneralLetterPreview = props => {
  const [letter, setLetter] = useState();
  const letterBaseApiRoute = `/api/cases/${props.match.params.id}/letters/${props.match.params.letterId}`;

  useEffect(() => {
    axios
      .get(`${letterBaseApiRoute}/preview`)
      .then(response => {
        if (
          response.data.addresses &&
          response.data.addresses.sender.substring(
            response.data.addresses.sender.length - 4,
            response.data.addresses.sender.length
          ) === "null"
        ) {
          response.data.addresses.sender =
            response.data.addresses.sender.substring(
              0,
              response.data.addresses.sender.length - 5
            );
        }
        setLetter(response.data);
      })
      .catch(error => console.log(error));
  }, []);

  const generateEditedLetter = async () => {
    try {
      await axios.put(
        `/api/cases/${props.match.params.id}/letters/${props.match.params.letterId}`,
        { editStatus: "Finalized" }
      );
      props.dispatch(push(`/cases/${props.match.params.id}`));
      props.dispatch(snackbarSuccess("Letter was generated successfully"));
    } catch (error) {}
  };

  return (
    <>
      {letter && (
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
          generateEditedLetter={generateEditedLetter}
          useLetterProgressStepper={false}
        />
      )}
    </>
  );
};

export default connect()(GeneralLetterPreview);
