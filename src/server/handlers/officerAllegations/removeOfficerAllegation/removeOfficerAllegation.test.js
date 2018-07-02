import {
  buildTokenWithPermissions,
  cleanupDatabase
} from "../../../testHelpers/requestTestHelpers";
import { createCaseWithoutCivilian } from "../../../testHelpers/modelMothers";
import CaseOfficer from "../../../../client/testUtilities/caseOfficer";
import Allegation from "../../../../client/testUtilities/Allegation";
import { ACCUSED } from "../../../../sharedUtilities/constants";
import OfficerAllegation from "../../../../client/testUtilities/OfficerAllegation";
import httpMocks from "node-mocks-http";
import models from "../../../models";
import removeOfficerAllegation from "./removeOfficerAllegation";
import Boom from "boom";
import app from "../../../server";
import request from "supertest";

describe("removeOfficerAllegation", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  test("should reply 404 if officer allegation does not exist", async () => {
    const nonexistentOfficerAllegationId = 12;

    const request = httpMocks.createRequest({
      method: "DELETE",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        officerAllegationId: nonexistentOfficerAllegationId
      },
      nickname: "TEST_USER_NICKNAME"
    });

    const response = httpMocks.createResponse();
    const next = jest.fn();

    await removeOfficerAllegation(request, response, next);

    expect(next).toHaveBeenCalledWith(
      Boom.notFound("Officer Allegation does not exist")
    );
  });

  test("should remove officer allegation", () => {
    test("should update officer allegation details", async () => {
      const token = buildTokenWithPermissions("", "TEST_NICKNAME");

      const createdCase = await createCaseWithoutCivilian();
      const anAllegation = new Allegation.Builder()
        .defaultAllegation()
        .withId(undefined)
        .build();

      const createdAllegation = await models.allegation.create(anAllegation, {
        auditUser: "someone"
      });
      const anOfficerAllegation = new OfficerAllegation.Builder()
        .defaultOfficerAllegation()
        .withId(undefined)
        .withDetails("old details")
        .withAllegationId(createdAllegation.id);

      const accusedOfficer = new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withUnknownOfficer()
        .withId(undefined)
        .withRoleOnCase(ACCUSED)
        .withOfficerAllegations([anOfficerAllegation])
        .build();

      const createdAccusedOfficer = await createdCase.createAccusedOfficer(
        accusedOfficer,
        {
          include: [
            {
              model: models.officer_allegation,
              as: "allegations",
              auditUser: "someone"
            }
          ],
          auditUser: "someone"
        }
      );

      const officerAllegationToRemove = createdAccusedOfficer.allegations[0];

      const request = httpMocks.createRequest({
        method: "DELETE",
        headers: {
          authorization: "Bearer SOME_MOCK_TOKEN"
        },
        params: {
          officerAllegationId: officerAllegationToRemove.id
        },
        nickname: "TEST_USER_NICKNAME"
      });

      const response = httpMocks.createResponse();

      await removeOfficerAllegation(request, response, jest.fn());

      await createdAccusedOfficer.reload();

      expect(createdAccusedOfficer.allegations).toEqual([]);
    });
  });
});
