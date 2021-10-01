import models from "../../../policeDataManager/models";
import Case from "../../../../sharedTestHelpers/case";
import CaseNote from "../../../testHelpers/caseNote";
import request from "supertest";
import app from "../../../server";
import {
  buildTokenWithPermissions,
  cleanupDatabase,
  expectResponse
} from "../../../testHelpers/requestTestHelpers";
import { NICKNAME, USERNAME } from "../../../../sharedUtilities/constants";
import { isAuthDisabled } from "../../../isAuthDisabled";

describe("editCaseNote request", function () {
  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("should edit a case note", async () => {
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
    const caseNoteAction = await models.case_note_action.create(
      {
        name: "Memo to file"
      },
      { auditUser: "testuser" }
    );
    const newCaseNoteAction = await models.case_note_action.create(
      {
        name: "Miscellaneous"
      },
      { auditUser: "testuser" }
    );
    const caseNoteToCreate = new CaseNote.Builder()
      .defaultCaseNote()
      .withCaseNoteActionId(caseNoteAction.id)
      .withNotes("default notes")
      .withCaseId(createdCase.id)
      .withUser(NICKNAME)
      .build();

    const createdCaseNote = await models.case_note.create(caseNoteToCreate, {
      auditUser: "someone"
    });

    const updatedCaseNote = {
      caseNoteActionId: newCaseNoteAction.id,
      notes: "updated notes"
    };

    const responsePromise = request(app)
      .put(`/api/cases/${createdCase.id}/case-notes/${createdCaseNote.id}`)
      .set("Content-Header", "application/json")
      .send({ ...updatedCaseNote, mentionedUsers: [] });

    if (!isAuthDisabled()) {
      responsePromise.set("Authorization", `Bearer ${token}`);
    }

    await expectResponse(
      responsePromise,
      200,
      expect.arrayContaining([
        expect.objectContaining({
          ...updatedCaseNote,
          id: createdCaseNote.id,
          author: expect.objectContaining({ email: NICKNAME })
        })
      ])
    );
  });
});
