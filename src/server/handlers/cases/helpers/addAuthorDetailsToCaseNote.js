import { userService } from "../../../../auth";

export const addAuthorDetailsToCaseNote = async rawCaseNotes => {
  const getUsersFromAuth0 = async () => {
    try {
      return await userService.getUsers();
    } catch (error) {
      return [];
    }
  };

  const users = await getUsersFromAuth0();

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
