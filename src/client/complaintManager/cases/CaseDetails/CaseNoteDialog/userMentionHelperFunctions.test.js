import {
  filterAfterTrigger,
  getMentionedUsers
} from "./userMentionHelperFunctions";
import { wait } from "@testing-library/dom";
const userList = [
  { label: "Syd Botz", value: "some@some.com" },
  { label: "Veronica Blackwell", value: "some@some.com" },
  { label: "Wanchen Yao", value: "some@some.com" }
];
describe("filterAfterTrigger", () => {
  test("should return user as Veronica when case note text is '@v' and cursor follows the 'v'", async () => {
    //ARRANGE
    const ref = { inputValue: "@v" };
    const cursorPosition = ref.inputValue.indexOf("v");

    //ACT
    const filteredUsers = filterAfterTrigger(userList, ref, cursorPosition);

    //ASSERT
    await wait(() => {
      expect(filteredUsers).toStrictEqual([userList[1]]);
    });
  });

  test("should return user as Veronica when case note text is 'my test text @v' and cursor follows the 'v'", async () => {
    //ARRANGE
    const ref = { inputValue: "my test text @v" };
    const cursorPosition = ref.inputValue.indexOf("v");

    //ACT
    const filteredUsers = filterAfterTrigger(userList, ref, cursorPosition);

    //ASSERT
    await wait(() => {
      expect(filteredUsers).toStrictEqual([userList[1]]);
    });
  });

  test("should return user as Veronica when case note text is 'more @v more words' and cursor follows the 'v' ", async () => {
    //ARRANGE
    const ref = { inputValue: "more @v more words" };
    const cursorPosition = ref.inputValue.indexOf("v");

    //ACT
    const filteredUsers = filterAfterTrigger(userList, ref, cursorPosition);

    //ASSERT
    await wait(() => {
      expect(filteredUsers).toStrictEqual([userList[1]]);
    });
  });

  test("should return user as Veronica when case note text is 'more @Syd Botz more more @v more words' and cursor follows the 'v' ", async () => {
    //ARRANGE
    const ref = {
      inputValue: "more @Syd Botz more more @v more @Wanchen Yao words"
    };
    const cursorPosition = ref.inputValue.indexOf("v");

    //ACT
    const filteredUsers = filterAfterTrigger(userList, ref, cursorPosition);

    //ASSERT
    await wait(() => {
      expect(filteredUsers).toStrictEqual([userList[1]]);
    });
  });
});

describe("getMentionedUsers", () => {
  test("should return empty list of users when case note does not have any mentioned users", () => {
    const caseNote = "there are no @ mentioned users here ";
    const mentionedUsers = getMentionedUsers(userList, caseNote);

    expect(mentionedUsers).toStrictEqual([]);
  });

  test("should return one mentioned user when case note has one mentioned user", () => {
    const caseNote = "@Wanchen Yao please mentioned another user";
    const mentionedUsers = getMentionedUsers(userList, caseNote);

    expect(mentionedUsers).toStrictEqual([userList[2]]);
  });

  test("should return one mentioned user when case note has one mentioned user and includes other names without '@'", () => {
    const caseNote = "Wanchen Yao please mentioned another user @Syd Botz";
    const mentionedUsers = getMentionedUsers(userList, caseNote);

    expect(mentionedUsers).toStrictEqual([userList[0]]);
  });

  test("should return one mentioned user when case note has one mentioned user and includes other names not correctly formatted", () => {
    const caseNote =
      "@Wanchen Yao please @veronica mentioned another user @Syd Botz Veronica Blackwell";
    const mentionedUsers = getMentionedUsers(userList, caseNote);

    expect(mentionedUsers).toEqual([userList[2], userList[0]]);
  });
});
