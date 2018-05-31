import models from "../../../models";
import buildTokenWithPermissions from "../../../requestTestHelpers";
import Case from "../../../../client/testUtilities/case";
import UserAction from "../../../../client/testUtilities/userAction";
import request from "supertest";
import app from "../../../server";

describe("editUserAction request", function() {
  afterEach(async () => {
    await models.cases.destroy({
      truncate: true,
      cascade: true,
      auditUser: "test user"
    });
    await models.user_action.destroy({
      truncate: true,
      cascade: true,
      force: true
    });
    await models.data_change_audit.truncate();
  });

  test("should edit a user action", async () => {
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
    const userActionToCreate = new UserAction.Builder()
      .defaultUserAction()
      .withUser("tuser")
      .withAction("Memo to file")
      .withNotes("default notes")
      .withCaseId(createdCase.id)
      .build();

    const createdUserAction = await models.user_action.create(
      userActionToCreate
    );
    const updatedUserAction = {
      action: "Miscellaneous",
      notes: "updated notes"
    };

    await request(app)
      .put(
        `/api/cases/${createdCase.id}/recent-activity/${createdUserAction.id}`
      )
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send(updatedUserAction)
      .expect(200)
      .then(response => {
        expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              ...updatedUserAction,
              id: createdUserAction.id,
              user: "tuser"
            })
          ])
        );
      });
  });
});
