import Civilian from "../testUtilities/civilian";
import getFirstComplainant from "./getFirstComplainant";
import { COMPLAINANT, WITNESS } from "../../../sharedUtilities/constants";

describe("getFirstComplainant", () => {
  test("should find a complainant if civilians with multiple roles on case exist", () => {
    const complainant = new Civilian.Builder()
      .defaultCivilian()
      .withRoleOnCase(COMPLAINANT);
    const witness = new Civilian.Builder()
      .defaultCivilian()
      .withRoleOnCase(WITNESS);

    const civilians = [complainant, witness];
    const result = getFirstComplainant(civilians);

    expect(result).toEqual(complainant);
  });

  test("should return undefined if no complainants exist", () => {
    const witness = new Civilian.Builder()
      .defaultCivilian()
      .withRoleOnCase(WITNESS);
    const civilians = [witness];
    const result = getFirstComplainant(civilians);

    expect(result).toBeUndefined();
  });
});
