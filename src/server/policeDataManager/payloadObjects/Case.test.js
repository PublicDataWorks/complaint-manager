import Case from "./Case";

describe("Case", () => {
  describe("constructor", () => {
    test("should save _status if currentStatus.name exists on model", () => {
      const fakeModel = { currentStatus: { name: "THE STATUS" } };
      const c4se = new Case(fakeModel);
      expect(c4se.model).toEqual(fakeModel);
      expect(c4se._status).toEqual("THE STATUS");
    });
  });

  describe("status", () => {});

  describe("toJSON", () => {});
});
