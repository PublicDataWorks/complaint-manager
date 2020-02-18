import TextField from "@material-ui/core/TextField";
import React, { useCallback, useEffect, useState } from "react";
import Autocomplete, {
  createFilterOptions
} from "@material-ui/lab/Autocomplete";
import * as _ from "lodash";
import {
  filterAfterTrigger,
  getIndexOfCurrentMention,
  getMentionedUsers
} from "./userMentionHelperFunctions";
import {
  useDetectCursorPosition,
  useSetCursorPosition
} from "./userMentionHooks";

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
  const [mentionedUsers, setMentionedUsers] = useState([]);
  const [cursorPosition, setCursorPosition] = useState(0);

  useEffect(() => {
    input.onChange(caseNoteText);
    const newUsers = getMentionedUsers(users, caseNoteText);
    setMentionedUsers(newUsers);
  }, [caseNoteText]);

  useDetectCursorPosition(useSetCursorPosition(setCursorPosition));

  const addUserMentionNameToCaseNote = value => {
    const indexOfTrigger = getIndexOfCurrentMention(
      caseNoteText,
      cursorPosition
    );
    const beginningOfCaseNote = caseNoteText.substring(0, indexOfTrigger + 1);
    const endOfCaseNote = caseNoteText.substring(cursorPosition + 1);

    return beginningOfCaseNote + value + endOfCaseNote;
  };

  const handleChange = (event, value) => {
    if (event) {
      if (
        event.type === "blur" ||
        event.type === "click" ||
        event.type === "keydown"
      ) {
        const updatedCaseNote = addUserMentionNameToCaseNote(value);
        setCaseNoteText(updatedCaseNote);
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
  };

  return (
    <Autocomplete
      freeSolo
      autoSelect={true}
      filterOptions={(options, ref) =>
        filterAfterTrigger(options, ref, cursorPosition)
      }
      options={users}
      getOptionLabel={option => {
        return _.isString(option) ? option : option.label;
      }}
      onInputChange={handleChange}
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
