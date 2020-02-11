import TextField from "@material-ui/core/TextField";
import React, { useEffect, useState } from "react";
import Autocomplete, {
  createFilterOptions
} from "@material-ui/lab/Autocomplete";
import FormControl from "@material-ui/core/FormControl";

export const TextFieldWithUserMention = props => {
  const {
    input,
    rowsMax,
    meta: { touched, error, warning },
    users,
    style,
    ...parentProps
  } = props;
  const [caseNoteText, setCaseNoteText] = useState(input.value);
  const [showUsers, setShowUsers] = useState(false);

  useEffect(() => {
    input.onChange(caseNoteText);
  }, [caseNoteText]);

  function handleChange(event, value) {
    if (event) {
      if (event.type === "click" || event.type === "keydown") {
        const indexOfTrigger = caseNoteText.indexOf("@");
        const updatedCaseNoteText = caseNoteText.substring(
          0,
          indexOfTrigger + 1
        );

        setCaseNoteText(updatedCaseNoteText + value);
        setShowUsers(false);
      }

      if (event.type === "change") {
        setCaseNoteText(event.target.value);

        if (event.target.value.includes("@")) {
          setShowUsers(true);
        } else {
          setShowUsers(false);
        }
      }
    }
  }

  const filterOptions = createFilterOptions({
    stringify: option => option.label
  });

  const filterAfterTrigger = (options, ref) => {
    const indexOfTrigger = ref.inputValue.indexOf("@");
    const updatedInput = ref.inputValue.substring(indexOfTrigger + 1);
    const newRef = { inputValue: updatedInput };
    return filterOptions(options, newRef);
  };

  return (
    <Autocomplete
      filterOptions={(options, ref) => filterAfterTrigger(options, ref)}
      freeSolo
      options={users}
      getOptionLabel={option => option.label}
      onInputChange={(event, value) => handleChange(event, value)}
      inputValue={caseNoteText}
      open={showUsers}
      disableClearable
      renderInput={params => {
        params.inputProps = {
          ...params.inputProps,
          ...parentProps.inputProps
        };
        return (
          <TextField
            {...params}
            multiline
            rowsMax={8}
            fullWidth
            placeholder="Enter any notes about this action"
          />
        );
      }}
    />
  );
};
