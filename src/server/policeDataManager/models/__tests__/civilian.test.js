import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import models from "../index";
import { CASE_STATUS } from "../../../../sharedUtilities/constants";
import {
  createTestCaseWithCivilian,
  createTestCaseWithoutCivilian
} from "../../../testHelpers/modelMothers";
import Civilian from "../../../../sharedTestHelpers/civilian";
import CaseStatus from "../../../../sharedTestHelpers/caseStatus";
import Case from "../../../../sharedTestHelpers/case";

describe("civilian", () => {
  beforeEach(async () => {
    await models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "user" }
    );
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("should NOT update case status when creating a civilian through a case association", async () => {
    const initialCase = await createTestCaseWithCivilian();

    const createdCivilians = await models.civilian.findAll();
    expect(createdCivilians.length).toEqual(1);
    expect(initialCase.status).toEqual(CASE_STATUS.INITIAL);
  });

  test("should update case status when adding a new civilian to a case", async () => {
    const initialCase = await createTestCaseWithoutCivilian();

    expect(initialCase.status).toEqual(CASE_STATUS.INITIAL);

    const complainantToCreate = new Civilian.Builder()
      .withRoleOnCase("Complainant")
      .defaultCivilian()
      .withId(undefined)
      .build();

    await initialCase.createComplainantCivilian(complainantToCreate, {
      auditUser: "someone"
    });

    await initialCase.reload();

    const createdComplainant = (await initialCase.getComplainantCivilians())[0];
    expect(createdComplainant).toEqual(
      expect.objectContaining({
        firstName: createdComplainant.firstName,
        lastName: createdComplainant.lastName,
        roleOnCase: createdComplainant.roleOnCase
      })
    );
    expect(initialCase.status).toEqual(CASE_STATUS.ACTIVE);
  });

  test("should update case status when updating an existing civilian on a case", async () => {
    const initialCase = await createTestCaseWithCivilian();

    const caseCivilians = await initialCase.getComplainantCivilians();
    const civilianToUpdate = caseCivilians[0];

    expect(initialCase.status).toEqual(CASE_STATUS.INITIAL);
    await civilianToUpdate.update(
      { roleOnCase: "Witness" },
      { auditUser: "someone" }
    );
    await civilianToUpdate.reload();
    await initialCase.reload();

    expect(civilianToUpdate.roleOnCase).toEqual("Witness");
    expect(initialCase.status).toEqual(CASE_STATUS.ACTIVE);
  });

  test("should update case status when removing an existing civilian on a case", async () => {
    const initialCase = await createTestCaseWithCivilian();

    let caseCivilians = await initialCase.getComplainantCivilians();
    const civilianIdToRemove = caseCivilians[0].id;

    expect(initialCase.status).toEqual(CASE_STATUS.INITIAL);

    await models.civilian.destroy({
      where: { id: civilianIdToRemove },
      auditUser: "someone"
    });

    await initialCase.reload();

    caseCivilians = await models.civilian.findAll();
    expect(caseCivilians.length).toEqual(0);
    expect(initialCase.status).toEqual(CASE_STATUS.ACTIVE);
  });

  test("should not update values to null", async () => {
    const c4se = await models.cases.create(new Case.Builder().defaultCase(), {
      auditUser: "user"
    });
    const civilian = await models.civilian.create(
      new Civilian.Builder().defaultCivilian().withCaseId(c4se.id),
      { auditUser: "user" }
    );
    const {
      firstName,
      middleInitial,
      lastName,
      suffix,
      email,
      additionalInfo
    } = civilian.toJSON();
    civilian.firstName = null;
    civilian.middleInitial = null;
    civilian.lastName = null;
    civilian.suffix = null;
    civilian.email = null;
    civilian.additionalInfo = null;
    expect(civilian.firstName).toEqual(firstName);
    expect(civilian.middleInitial).toEqual(middleInitial);
    expect(civilian.lastName).toEqual(lastName);
    expect(civilian.suffix).toEqual(suffix);
    expect(civilian.email).toEqual(email);
    expect(civilian.additionalInfo).toEqual(additionalInfo);
  });
});
