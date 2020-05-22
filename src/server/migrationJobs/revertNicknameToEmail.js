const emailsToTransform = [
  "alowe@nolaipm.gov",
  "scziment@nolaipm.gov",
  "shutson@nolaipm.gov",
  "lvillasanta@nolaipm.gov"
];

const updateAuthorFieldToRemoveEmail = async (caseNote, transaction) => {
  const author = caseNote.user;

  if (emailsToTransform.includes(author)) {
    const nickname = author.split("@")[0];
    await caseNote.update(
      { user: nickname },
      {
        auditUser: "Migration for Email to Nickname for Prod Users"
      }
    );
  }
};

const revertNicknameToEmail = async (caseNotes, transaction) => {
  for (const i in caseNotes) {
    const caseNote = caseNotes[i];
    await updateAuthorFieldToRemoveEmail(caseNote, transaction);
  }
};

export default revertNicknameToEmail;
