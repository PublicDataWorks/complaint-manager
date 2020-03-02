import { createFilterOptions } from "@material-ui/lab/Autocomplete";

export const getMentionedUsers = (users, caseNoteText) => {
  let updatedMentionedUsers = [];
  caseNoteText = caseNoteText.substring(caseNoteText.indexOf("@"));
  const splitCaseNotes = caseNoteText.split("@");

  const compare = (user1, user2) => {
    if (user1.label.length > user2.label.length) return -1;
    if (user1.label.length < user2.label.length) return 1;

    return 0;
  };

  const sortedUsers = [...users];
  sortedUsers.sort(compare);

  for (const subStringIndex in splitCaseNotes) {
    let subString = splitCaseNotes[subStringIndex];
    for (const user in sortedUsers) {
      let userName = sortedUsers[user].label;
      if (
        subString.startsWith(userName) &&
        !updatedMentionedUsers.includes(sortedUsers[user])
      ) {
        updatedMentionedUsers.push(sortedUsers[user]);
        break;
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
    cursorPosition
  );
  const newRef = { inputValue: updatedInput };
  return createFilterOptions({ stringify: option => option.label })(
    options,
    newRef
  );
};
