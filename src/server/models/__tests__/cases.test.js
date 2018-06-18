import models from "../index";
import { createCaseWithoutCivilian } from "../../modelTestHelpers/helpers";
import Civilian from "../../../client/testUtilities/civilian";
import { CASE_STATUS } from "../../../sharedUtilities/constants";
import {cleanupDatabase} from "../../requestTestHelpers";

describe("cases", function() {
  let createdCase;

  beforeEach(async () => {
    createdCase = await createCaseWithoutCivilian();
  });

  afterEach(async () => {
    await cleanupDatabase()
  });

  test("should not change status when updating nothing", async () => {
    await createdCase.update({}, { auditUser: "Someone" });

    await createdCase.reload();
    expect(createdCase.status).toEqual(CASE_STATUS.INITIAL);
  });

  test("should change status from initial to active when updating something", async () => {
    await createdCase.update(
      { assignedTo: "someone else" },
      { auditUser: "Someone" }
    );

    await createdCase.reload();
    expect(createdCase.status).toEqual(CASE_STATUS.ACTIVE);
  });

  test("should changes status when updating through class update", async() => {
    await models.cases.update(
      { assignedTo: "someone else" },
      { where: {id: createdCase.id}, auditUser: "Someone" }
    );

    await createdCase.reload();
    expect(createdCase.status).toEqual(CASE_STATUS.ACTIVE);

  })

  test("should NOT update case status to Active when not Initial", async () => {
    const civilianToAdd = new Civilian.Builder()
      .defaultCivilian()
      .withRoleOnCase("Complainant")
      .withId(undefined)
      .build();

    const anotherCivilianToAdd = new Civilian.Builder()
      .defaultCivilian()
      .withRoleOnCase("Witness")
      .withId(undefined)
      .build();

    await createdCase.createComplainantCivilian(civilianToAdd, {
      auditUser: "someone"
    });
    await createdCase.reload();
    expect(createdCase.status).toEqual(CASE_STATUS.ACTIVE);

    await createdCase.update(
      { status: "Ready for Review" },
      { auditUser: "someone" }
    );
    await createdCase.reload();
    expect(createdCase.status).toEqual(CASE_STATUS.READY_FOR_REVIEW);

    await createdCase.createWitnessCivilian(anotherCivilianToAdd, {
      auditUser: "someone"
    });
    await createdCase.reload();
    expect(createdCase.status).toEqual(CASE_STATUS.READY_FOR_REVIEW);
  });

  test("should not update case status to active when main update fails", async () => {
    expect(createdCase.status).toEqual(CASE_STATUS.INITIAL);
    try {
      await createdCase.update({createdBy: null}, {auditUser: 'someone'})
    }catch(error){
    }
    await createdCase.reload();
    expect(createdCase.createdBy).not.toBeNull();
    expect(createdCase.status).toEqual(CASE_STATUS.INITIAL);
  })
});
