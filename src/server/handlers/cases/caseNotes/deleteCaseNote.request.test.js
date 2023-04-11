import models from "../../../policeDataManager/models/index";
import app from "../../../server";
import request from "supertest";
import Case from "../../../../sharedTestHelpers/case";
import CaseStatus from "../../../../sharedTestHelpers/caseStatus";
import CaseNote from "../../../testHelpers/caseNote";
import {
  buildTokenWithPermissions,
  cleanupDatabase,
  expectResponse
} from "../../../testHelpers/requestTestHelpers";
import { CASE_STATUS, NICKNAME } from "../../../../sharedUtilities/constants";
import { isAuthDisabled } from "../../../isAuthDisabled";
import { seedStandardCaseStatuses } from "../../../testHelpers/testSeeding";

jest.mock(
  "../../../getFeaturesAsync",
  () => callback =>
    callback([
      {
        id: "FEATURE",
        name: "FEATURE",
        description: "This is a feature",
        enabled: true
      }
    ])
);

describe("deleteCaseNote request", () => {
  jest.setTimeout(50000);
  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  beforeEach(async () => {
    await cleanupDatabase();
    await seedStandardCaseStatuses();
  });

  test("should delete a case note", async () => {
    const token = buildTokenWithPermissions("", NICKNAME);

    const caseToCreate = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withComplainantCivilians([])
      .withAttachments([])
      .withAccusedOfficers([])
      .withIncidentLocation(undefined)
      .build();

    const createdCase = await models.cases.create(caseToCreate, {
      auditUser: "someone"
    });

    const caseNoteToCreate = new CaseNote.Builder()
      .defaultCaseNote()
      .withCaseId(createdCase.id)
      .withUser(NICKNAME)
      .build();

    const createdCaseNote = await models.case_note.create(caseNoteToCreate, {
      auditUser: "someone"
    });

    const responsePromise = request(app)
      .delete(`/api/cases/${createdCase.id}/case-notes/${createdCaseNote.id}`)
      .set("Content-Header", "application/json");

    if (!isAuthDisabled()) {
      responsePromise.set("Authorization", `Bearer ${token}`);
    }

    await expectResponse(
      responsePromise,
      200,
      expect.objectContaining({
        caseNotes: [],
        caseDetails: expect.objectContaining({
          id: createdCase.id,
          status: CASE_STATUS.ACTIVE
        })
      })
    );
  });
});
