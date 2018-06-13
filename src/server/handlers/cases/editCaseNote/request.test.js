import models from "../../../models";
import buildTokenWithPermissions from "../../../requestTestHelpers";
import Case from "../../../../client/testUtilities/case";
import CaseNote from "../../../../client/testUtilities/caseNote";
import request from "supertest";
import app from "../../../server";

describe("editCaseNote request", function() {
  afterEach(async () => {
    await models.cases.destroy({
      truncate: true,
      cascade: true,
      auditUser: "test user"
    });
    await models.case_note.destroy({
      truncate: true,
      cascade: true,
      force: true,
      auditUser: "someone"
    });
    await models.data_change_audit.truncate();
  });

  test("should edit a case note", async () => {
    const token = buildTokenWithPermissions("", "tuser");

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
      .withUser("tuser")
      .withAction("Memo to file")
      .withNotes("default notes")
      .withCaseId(createdCase.id)
      .build();

    const createdCaseNote = await models.case_note.create(
      caseNoteToCreate,
      { auditUser: "someone" }
    );
    const updatedCaseNote = {
      action: "Miscellaneous",
      notes: "updated notes"
    };

    await request(app)
      .put(
        `/api/cases/${createdCase.id}/recent-activity/${createdCaseNote.id}`
      )
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send(updatedCaseNote)
      .expect(200)
      .then(response => {
        expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              ...updatedCaseNote,
              id: createdCaseNote.id,
              user: "tuser"
            })
          ])
        );
      });
  });
});
