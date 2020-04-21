import { getUsersFromAuth0 } from "../../../common/handlers/users/getUsers";

export const addAuthorDetailsToCaseNote = async rawCaseNotes => {
  const getUsers = async () => {
    try {
      return await getUsersFromAuth0();
    } catch (error) {
      return [];
    }
  };

  const users = await getUsers();

  const getAuthorName = authorEmail => {
    const user = users.find(user => user.email === authorEmail);

    return user ? user.name : "";
  };

  const caseNotes = rawCaseNotes.map(rawCaseNote => {
    let caseNote;
    const author = rawCaseNote.get("user");
    delete rawCaseNote["dataValues"]["user"];
    caseNote = {
      ...rawCaseNote.dataValues,
      author: {
        name: getAuthorName(author),
        email: author
      }
    };
    return caseNote;
  });

  return caseNotes;
};
