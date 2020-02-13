import { createFilterOptions } from "@material-ui/lab/Autocomplete";

export const getMentionedUsers = (users, caseNoteText) => {
  let updatedMentionedUsers = [];
  caseNoteText = caseNoteText.substring(caseNoteText.indexOf("@"));
  const splitCaseNotes = caseNoteText.split("@");
  for (const subStringIndex in splitCaseNotes) {
    let subString = splitCaseNotes[subStringIndex];
    for (const user in users) {
      let userName = users[user].label;
      if (
        subString.startsWith(userName) &&
        !updatedMentionedUsers.includes(users[user])
      ) {
        updatedMentionedUsers.push(users[user]);
      }
    }
  }
  return updatedMentionedUsers;
};

export const getIndexOfCurrentMention = (message, cursorPosition) => {
  let startOfMention = cursorPosition;
  while (startOfMention > 0 && message[startOfMention] !== "@") {
    startOfMention -= 1;
  }
  return startOfMention;
};

export const filterAfterTrigger = (options, ref, cursorPosition) => {
  const updatedInput = ref.inputValue.substring(
    getIndexOfCurrentMention(ref.inputValue, cursorPosition) + 1,
    cursorPosition + 1
  );

  const newRef = { inputValue: updatedInput };
  return createFilterOptions({ stringify: option => option.label })(
    options,
    newRef
  );
};
