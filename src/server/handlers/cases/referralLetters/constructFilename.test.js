import constructFilename from "./constructFilename";
import models from "../../../models";
import {
  CIVILIAN_INITIATED,
  LETTER_TYPE,
  REFERRAL_LETTER_VERSION
} from "../../../../sharedUtilities/constants";
import Case from "../../../../client/testUtilities/case";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";

describe("constructFilename", function() {
  afterEach(async () => {
    await cleanupDatabase();
  });

  test("returns correct final pdf filename with complainant", async () => {
    const existingCase = await createCase(true);
    const filename = constructFilename(
      existingCase,
      REFERRAL_LETTER_VERSION.FINAL
    );
    const expectedFilename = "88/5-5-2012_CC2012-0088_PIB_Referral_Smith.pdf";
    expect(filename).toEqual(expectedFilename);
  });

  test("returns correct final pdf filename without complainant", async () => {
    const existingCase = await createCase(false);
    const filename = constructFilename(
      existingCase,
      REFERRAL_LETTER_VERSION.FINAL
    );
    const expectedFilename = "88/5-5-2012_CC2012-0088_PIB_Referral.pdf";
    expect(filename).toEqual(expectedFilename);
  });

  test("returns correct generated preview pdf filename with complainant", async () => {
    const existingCase = await createCase(true);
    const filename = constructFilename(
      existingCase,
      REFERRAL_LETTER_VERSION.DRAFT,
      LETTER_TYPE.GENERATED
    );
    const expectedFilename =
      "5-5-2012_CC2012-0088_Generated_Referral_Draft_Smith.pdf";
    expect(filename).toEqual(expectedFilename);
  });

  test("returns correct generated preview pdf filename without complainant", async () => {
    const existingCase = await createCase(false);
    const filename = constructFilename(
      existingCase,
      REFERRAL_LETTER_VERSION.DRAFT,
      LETTER_TYPE.GENERATED
    );
    const expectedFilename =
      "5-5-2012_CC2012-0088_Generated_Referral_Draft.pdf";
    expect(filename).toEqual(expectedFilename);
  });

  test("returns correct edited preview pdf filename with complainant", async () => {
    const existingCase = await createCase(true);
    const filename = constructFilename(
      existingCase,
      REFERRAL_LETTER_VERSION.DRAFT,
      LETTER_TYPE.EDITED
    );
    const expectedFilename =
      "5-5-2012_CC2012-0088_Edited_Referral_Draft_Smith.pdf";
    expect(filename).toEqual(expectedFilename);
  });

  test("returns correct edited preview pdf filename without complainant", async () => {
    const existingCase = await createCase(false);
    const filename = constructFilename(
      existingCase,
      REFERRAL_LETTER_VERSION.DRAFT,
      LETTER_TYPE.EDITED
    );
    const expectedFilename = "5-5-2012_CC2012-0088_Edited_Referral_Draft.pdf";
    expect(filename).toEqual(expectedFilename);
  });
});

const createCase = async includeCivilian => {
  const civilians = includeCivilian ? [{ lastName: "Smith" }] : [];
  const existingCaseAttributes = new Case.Builder()
    .defaultCase()
    .withFirstContactDate("2012-05-05")
    .withId(88)
    .withComplaintType(CIVILIAN_INITIATED)
    .withComplainantCivilians(civilians);
  return await models.cases.create(existingCaseAttributes, {
    auditUser: "someone",
    include: [
      {
        model: models.civilian,
        as: "complainantCivilians",
        auditUser: "someone"
      }
    ]
  });
};
