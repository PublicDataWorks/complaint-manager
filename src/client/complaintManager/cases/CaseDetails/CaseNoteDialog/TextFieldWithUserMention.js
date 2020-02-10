import TextField from "@material-ui/core/TextField";
import React, { useState } from "react";

export const TextFieldWithUserMention = props => {
  const [caseNoteText, setCaseNoteText] = useState("");
  const [showUsers, setShowUsers] = useState(false);
  console.log("Users in Our Component", props.users);

  const {
    input,
    rowsMax,
    meta: { touched, error, warning }
  } = props;

  function handleChange(event) {
    console.log("Event", event.target.value);
    setCaseNoteText(event.target.value);

    if (event.target.value.includes("@")) {
      setShowUsers(true);
      console.log("Show me some users!");
    } else {
      setShowUsers(false);
      console.log("Please dont mention me");
    }
  }
  return (
    <div>
      <TextField
        error={touched && !!error}
        helperText={touched && error ? touched && error : null}
        rowsMax={rowsMax ? rowsMax : 1}
        {...input}
        {...props}
        onChange={event => handleChange(event)}
        value={caseNoteText}
      />
      {showUsers ? <p> this is a dropdown</p> : null}
    </div>
  );
};
