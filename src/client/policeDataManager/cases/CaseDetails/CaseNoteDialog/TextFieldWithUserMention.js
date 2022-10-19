import TextField from "@material-ui/core/TextField";
import React, { useEffect, useRef, useState } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import * as _ from "lodash";
import {
  getIndexOfCurrentMention,
  getMentionedUsers,
  keyDownEvent
} from "./userMentionHelperFunctions";
import { useRunAfterUpdate } from "./userMentionHooks";
import useOnClickOutside from "../../../shared/components/Notification/useOnClickOutside";

export const TextFieldWithUserMention = props => {
  const {
    input,
    meta: { touched, error, warning },
    users,
    style,
    filterAfterMention,
    ...parentProps
  } = props;
  const [caseNoteText, setCaseNoteText] = useState(input.value);
  const [showUsers, setShowUsers] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const runAfterUpdate = useRunAfterUpdate();
  const ref = useRef();

  useEffect(() => {
    input.onChange(caseNoteText);
    const mentionedUsers = getMentionedUsers(users, caseNoteText);
    props.onSetMentionedUsers(mentionedUsers);
  }, [caseNoteText]);

  useOnClickOutside(ref, () => {
    setShowUsers(false);
  });

  const addUserMentionNameToCaseNote = value => {
    const indexOfTrigger = getIndexOfCurrentMention(
      caseNoteText,
      cursorPosition
    );
    const beginningOfCaseNote = caseNoteText.substring(0, indexOfTrigger + 1);
    const endOfCaseNote = caseNoteText.substring(cursorPosition);

    return beginningOfCaseNote + value + " " + endOfCaseNote;
  };

  const updateCursorPosition = (value, textInput) => {
    const newCursorPosition =
      getIndexOfCurrentMention(caseNoteText, cursorPosition) + value.length + 2;
    textInput.selectionStart = newCursorPosition;
    textInput.selectionEnd = newCursorPosition;
    setCursorPosition(newCursorPosition);
  };

  const handleChange = (event, value) => {
    if (event) {
      let textInput = event.target;
      const type = event.type;
      if (type === "change") {
        setCaseNoteText(value);
        setCursorPosition(textInput.selectionStart);

        if (props.displayUserDropdown(value, textInput.selectionStart)) {
          setShowUsers(true);
          keyDownEvent();
        } else {
          setShowUsers(false);
        }
        return;
      } else {
        if (type === "click") {
          textInput = document.querySelector(
            'textarea[placeholder="Enter any notes about this action"]'
          );
        }
        const updatedCaseNote = addUserMentionNameToCaseNote(value);

        setCaseNoteText(updatedCaseNote);
        setShowUsers(false);
        runAfterUpdate(() => {
          updateCursorPosition(value, textInput);
        });
        return;
      }
    }
  };

  return (
    <Autocomplete
      data-testid="user-dropdown"
      freeSolo
      ref={ref}
      autoSelect={true}
      filterOptions={(options, ref) =>
        filterAfterMention(options, ref, cursorPosition)
      }
      options={users}
      getOptionLabel={option => {
        return _.isString(option) ? option : option.label;
      }}
      value={{ label: "", value: "" }}
      onInputChange={handleChange}
      inputValue={caseNoteText}
      open={showUsers}
      disableClearable
      renderInput={params => {
        params.inputProps = {
          ...params.inputProps,
          ...parentProps.inputProps,
          spellCheck: true
        };
        return (
          <TextField
            {...params}
            multiline
            maxRows={8}
            fullWidth
            placeholder="Enter any notes about this action"
          />
        );
      }}
    />
  );
};
