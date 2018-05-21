import buildTokenWithPermissions from "../../../requestTestHelpers";
import models from "../../../models/index";
import app from "../../../server";
import request from "supertest";
import Case from "../../../../client/testUtilities/case";
import UserAction from "../../../../client/testUtilities/userAction";

describe("removeUserAction request", () => {
  afterEach(async () => {
    await models.cases.destroy({ truncate: true, cascade: true });
    await models.user_action.destroy({
      truncate: true,
      cascade: true,
      force: true
    });
  });

  test("should remove a user action", async () => {
    const token = buildTokenWithPermissions("", "tuser");

    const caseToCreate = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withCivilians([])
      .withAttachments([])
      .withAccusedOfficers([])
      .withIncidentLocation(undefined)
      .build();

    const createdCase = await models.cases.create(caseToCreate, {
      auditUser: "someone"
    });

    const userActionToCreate = new UserAction.Builder()
      .defaultUserAction()
      .withCaseId(createdCase.id)
      .build();

    const createdUserAction = await models.user_action.create(
      userActionToCreate
    );

    await request(app)
      .delete(
        `/api/cases/${createdCase.id}/recent-activity/${createdUserAction.id}`
      )
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then(response => {
        const currentCase = response.body;

        expect(currentCase).toEqual(
          expect.objectContaining({
            recentActivity: [],
            caseDetails: expect.objectContaining({
              id: createdCase.id,
              status: "Active"
            })
          })
        );
      });
  });
});
