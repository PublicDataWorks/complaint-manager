import allegationMenuDisplay from "./allegationMenuDisplay";
import { getAllegationsSuccess } from "../../actionCreators/allegationsActionCreators";

describe("allegationMenuDisplay reducer", function() {
  test("should set default state", () => {
    const newState = allegationMenuDisplay(undefined, { type: "SOME_ACTION" });
    expect(newState).toEqual([]);
  });

  test("should return allegations on get allegation success", () => {
    const allegations = [
      { some: "allegation data" },
      { some: "allegation data" }
    ];
    const newState = allegationMenuDisplay(
      [],
      getAllegationsSuccess(allegations)
    );

    expect(newState).toEqual(allegations);
  });
});
