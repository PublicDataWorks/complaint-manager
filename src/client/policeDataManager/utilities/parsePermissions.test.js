import parsePermissions from "./parsePermissions";

describe("parse permissions", () => {
  test("should parse out permissions from scope", () => {
    const scope = "openid profile foo bar baz";
    const parsedPermissions = parsePermissions(scope);

    const expectedPermissions = ["foo", "bar", "baz"];

    expect(parsedPermissions).toEqual(expectedPermissions);
  });

  test("should set empty permissions if scope null", () => {
    const scope = null;

    const parsedPermissions = parsePermissions(scope);
    const expectedPermissions = [];

    expect(parsedPermissions).toEqual(expectedPermissions);
  });

  test("should set empty permissions if scope undefined", () => {
    const scope = undefined;

    const parsedPermissions = parsePermissions(scope);
    const expectedPermissions = [];

    expect(parsedPermissions).toEqual(expectedPermissions);
  });

  test("should set empty permissions if scope is an empty string", () => {
    const scope = "";

    const parsedPermissions = parsePermissions(scope);
    const expectedPermissions = [];

    expect(parsedPermissions).toEqual(expectedPermissions);
  });
});
