import Civilian from "../testUtilities/civilian";
import getFirstComplainant from "./getFirstComplainant";

describe("getFirstComplainant", () => {
  test("should find a complainant if civilians with multiple roles on case exist", () => {
    const complainant = new Civilian.Builder()
      .defaultCivilian()
      .withRoleOnCase("Complainant");
    const witness = new Civilian.Builder()
      .defaultCivilian()
      .withRoleOnCase("Witness");

    const civilians = [complainant, witness];
    const result = getFirstComplainant(civilians);

    expect(result).toEqual(complainant);
  });

  test("should return undefined if no complainants exist", () => {
    const witness = new Civilian.Builder()
      .defaultCivilian()
      .withRoleOnCase("Witness");
    const civilians = [witness];
    const result = getFirstComplainant(civilians);

    expect(result).toBeUndefined();
  });
});
