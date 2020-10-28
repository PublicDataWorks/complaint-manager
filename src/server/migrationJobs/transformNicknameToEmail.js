import models from "../policeDataManager/models";

const nicknamesToTransform = ["alowe", "scziment", "shutson", "lvillasanta"];

const updateAuthorField = async (caseNote, transaction) => {
  const author = caseNote.user;

  if (nicknamesToTransform.includes(author)) {
    const email = author + "@nolaipm.gov";
    await caseNote.update(
      { user: email },
      {
        auditUser: "Migration for Nickname to Email for Prod Users"
      }
    );
  }
};

const transformNicknameToEmail = async (caseNotes, transaction) => {
  for (const i in caseNotes) {
    const caseNote = caseNotes[i];
    await updateAuthorField(caseNote, transaction);
  }
};

export default transformNicknameToEmail;
