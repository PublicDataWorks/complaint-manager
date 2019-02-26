import { createTestCaseWithCivilian } from "../../../testHelpers/modelMothers";
import models from "../../../models";
import getCases, { CASES_TYPE } from "./getCases";
import Case from "../../../../client/testUtilities/case";
import getArchivedCases from "./getArchivedCases";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";

describe("test", () => {
  const auditUser = "user";
  let existingArchivedCase;
  beforeEach(async () => {
    existingArchivedCase = await createTestCaseWithCivilian();
    await existingArchivedCase.destroy({ auditUser: auditUser });
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  test("should get all archived cases", async () => {
    const cases = await models.sequelize.transaction(async transaction => {
      return await getCases(CASES_TYPE.ARCHIVED, transaction);
    });

    expect(cases).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: existingArchivedCase.id,
          complainantCivilians: expect.arrayContaining([
            expect.objectContaining({ firstName: "Chuck" })
          ])
        })
      ])
    );

    expect(cases).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          deletedAt: null
        })
      ])
    );
  });

  test("should not get unarchived case", async () => {
    const existingUnarchivedCaseAttributes = new Case.Builder()
      .defaultCase()
      .withId(undefined);
    const existingUnarchivedCase = await models.cases.create(
      existingUnarchivedCaseAttributes,
      {
        auditUser: auditUser
      }
    );

    const cases = await models.sequelize.transaction(async transaction => {
      return await getCases(CASES_TYPE.ARCHIVED, transaction);
    });

    expect(cases).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: existingUnarchivedCase.id })
      ])
    );
  });
});
