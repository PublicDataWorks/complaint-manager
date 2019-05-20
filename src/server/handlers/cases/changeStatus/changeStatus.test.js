import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import { createTestCaseWithoutCivilian } from "../../../testHelpers/modelMothers";
import changeStatus from "./changeStatus";
import {
  ACCUSED,
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  AUDIT_TYPE,
  CASE_STATUS,
  USER_PERMISSIONS
} from "../../../../sharedUtilities/constants";
import httpMocks from "node-mocks-http";
import Boom from "boom";
import models from "../../../models/index";
import Officer from "../../../../client/testUtilities/Officer";
import CaseOfficer from "../../../../client/testUtilities/caseOfficer";
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";
import mockFflipObject from "../../../testHelpers/mockFflipObject";
import auditDataAccess from "../../auditDataAccess";

//mocked implementation in "/handlers/__mocks__/getQueryAuditAccessDetails"
jest.mock("../../getQueryAuditAccessDetails");
jest.mock("../../auditDataAccess");

describe("changeStatus", async () => {
  let initialCase, response, next;

  beforeEach(async () => {
    initialCase = await createTestCaseWithoutCivilian();
    next = jest.fn();
    response = httpMocks.createResponse();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  test("should update case status", async () => {
    const newStatus = CASE_STATUS.ACTIVE;
    const request = httpMocks.createRequest({
      method: "PUT",
      params: {
        caseId: initialCase.id
      },
      body: {
        status: newStatus
      },
      nickname: "someone"
    });

    await changeStatus(request, response, next);
    await initialCase.reload();

    expect(initialCase.status).toEqual(CASE_STATUS.ACTIVE);
  });

  test("should call next with error if given unknown status", async () => {
    const request = httpMocks.createRequest({
      method: "PUT",
      params: {
        caseId: initialCase.id
      },
      body: {
        status: "BLAH"
      },
      nickname: "someone"
    });

    await changeStatus(request, response, next);
    await initialCase.reload();

    expect(next).toBeCalledWith(
      Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_CASE_STATUS_FOR_UPDATE)
    );
    expect(initialCase.status).toEqual(CASE_STATUS.INITIAL);
  });

  test("creates empty letter if status changes to LETTER_IN_PROGRESS", async () => {
    await initialCase.update(
      { status: CASE_STATUS.ACTIVE },
      { auditUser: "someone" }
    );
    const request = httpMocks.createRequest({
      method: "PUT",
      params: {
        caseId: initialCase.id
      },
      body: {
        status: CASE_STATUS.LETTER_IN_PROGRESS
      },
      nickname: "someone"
    });

    await changeStatus(request, response, next);

    const letterCreated = await models.referral_letter.findOne({
      where: { caseId: initialCase.id }
    });
    expect(letterCreated).not.toBeNull();

    await initialCase.reload();
    expect(initialCase.status).toEqual(CASE_STATUS.LETTER_IN_PROGRESS);
  });

  test("does not create letter if status changing to something other than LETTER_IN_PROGRESS", async () => {
    const request = httpMocks.createRequest({
      method: "PUT",
      params: {
        caseId: initialCase.id
      },
      body: {
        status: CASE_STATUS.ACTIVE
      },
      nickname: "someone"
    });

    await changeStatus(request, response, next);

    const letterCreated = await models.referral_letter.findOne({
      where: { caseId: initialCase.id }
    });
    expect(letterCreated).toBeNull();

    await initialCase.reload();
    expect(initialCase.status).toEqual(CASE_STATUS.ACTIVE);
  });

  test("does not create letter if status change fails (from initial to letter gen is invalid)", async () => {
    const request = httpMocks.createRequest({
      method: "PUT",
      params: {
        caseId: initialCase.id
      },
      body: {
        status: CASE_STATUS.LETTER_IN_PROGRESS
      },
      nickname: "someone"
    });

    await changeStatus(request, response, next);

    const letterCreated = await models.referral_letter.findOne({
      where: { caseId: initialCase.id }
    });
    expect(letterCreated).toBeNull();

    await initialCase.reload();
    expect(initialCase.status).toEqual(CASE_STATUS.INITIAL);
    expect(next).toHaveBeenCalledWith(
      Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_CASE_STATUS_FOR_UPDATE)
    );
  });

  describe("auditing when newAuditFeature disabled", () => {
    test("should audit case details", async () => {
      const newStatus = CASE_STATUS.ACTIVE;
      const request = httpMocks.createRequest({
        method: "PUT",
        params: {
          caseId: initialCase.id
        },
        fflip: mockFflipObject({
          newAuditFeature: false
        }),
        body: {
          status: newStatus
        },
        nickname: "someone"
      });

      await changeStatus(request, response, next);

      const actionAudit = await models.action_audit.findOne({
        where: { caseId: initialCase.id }
      });

      expect(actionAudit).toEqual(
        expect.objectContaining({
          user: "someone",
          action: AUDIT_ACTION.DATA_ACCESSED,
          auditType: AUDIT_TYPE.DATA_ACCESS,
          subject: AUDIT_SUBJECT.CASE_DETAILS,
          caseId: initialCase.id,
          auditDetails: { ["Mock Association"]: ["Mock Details"] }
        })
      );
    });
  });

  describe("auditing when newAuditFeature enabled", () => {
    test("should audit case details", async () => {
      const newStatus = CASE_STATUS.ACTIVE;
      const request = httpMocks.createRequest({
        method: "PUT",
        params: {
          caseId: initialCase.id
        },
        fflip: mockFflipObject({ newAuditFeature: true }),
        body: {
          status: newStatus
        },
        nickname: "someone"
      });

      await changeStatus(request, response, next);

      expect(auditDataAccess).toHaveBeenCalledWith(
        request.nickname,
        initialCase.id,
        AUDIT_SUBJECT.CASE_DETAILS,
        {
          mockAssociation: {
            attributes: ["mockDetails"],
            model: "mockModelName"
          }
        },
        expect.anything()
      );
    });
  });

  describe("Accused Officers on the Case", function() {
    let accusedCaseOfficer1, accusedCaseOfficer2;

    beforeEach(async function() {
      const officerAttributes1 = new Officer.Builder()
        .defaultOfficer()
        .withId(undefined)
        .withOfficerNumber(123);

      const officerAttributes2 = new Officer.Builder()
        .defaultOfficer()
        .withId(undefined)
        .withOfficerNumber(321);

      const officer1 = await models.officer.create(officerAttributes1, {
        auditUser: "someone"
      });

      const officer2 = await models.officer.create(officerAttributes2, {
        auditUser: "someone"
      });

      const accusedCaseOfficerAttributes1 = new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withId(undefined)
        .withCaseId(initialCase.id)
        .withOfficerId(officer1.id)
        .withRoleOnCase(ACCUSED);

      const accusedCaseOfficerAttributes2 = new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withId(undefined)
        .withCaseId(initialCase.id)
        .withOfficerId(officer2.id)
        .withRoleOnCase(ACCUSED);

      accusedCaseOfficer1 = await models.case_officer.create(
        accusedCaseOfficerAttributes1,
        { auditUser: "someone" }
      );

      accusedCaseOfficer2 = await models.case_officer.create(
        accusedCaseOfficerAttributes2,
        { auditUser: "someone" }
      );
    });

    test("creates a letter officer for each accused officer if changes to LETTER_IN_PROGRESS", async () => {
      await initialCase.update(
        { status: CASE_STATUS.ACTIVE },
        { auditUser: "someone" }
      );
      const request = httpMocks.createRequest({
        method: "PUT",
        params: {
          caseId: initialCase.id
        },
        body: {
          status: CASE_STATUS.LETTER_IN_PROGRESS
        },
        nickname: "someone"
      });

      await changeStatus(request, response, next);

      const letterOfficer1 = await models.letter_officer.findOne({
        where: { caseOfficerId: accusedCaseOfficer1.id }
      });

      const letterOfficer2 = await models.letter_officer.findOne({
        where: { caseOfficerId: accusedCaseOfficer2.id }
      });

      expect(letterOfficer1).not.toBeNull();
      expect(letterOfficer2).not.toBeNull();

      await initialCase.reload();
      expect(initialCase.status).toEqual(CASE_STATUS.LETTER_IN_PROGRESS);
    });

    test("does not create letter officers if status changing to something other than LETTER_IN_PROGRESS", async () => {
      const request = httpMocks.createRequest({
        method: "PUT",
        params: {
          caseId: initialCase.id
        },
        body: {
          status: CASE_STATUS.ACTIVE
        },
        nickname: "someone"
      });

      await changeStatus(request, response, next);

      const letterOfficer1 = await models.letter_officer.findOne({
        where: { caseOfficerId: accusedCaseOfficer1.id }
      });

      const letterOfficer2 = await models.letter_officer.findOne({
        where: { caseOfficerId: accusedCaseOfficer2.id }
      });

      expect(letterOfficer1).toBeNull();
      expect(letterOfficer2).toBeNull();

      await initialCase.reload();
      expect(initialCase.status).toEqual(CASE_STATUS.ACTIVE);
    });
  });

  describe("user has permission to update case status", async () => {
    test("should update case status from letter in progress to ready for review to forwarded to agency", async () => {
      await initialCase.update(
        { status: CASE_STATUS.ACTIVE },
        { auditUser: "someone" }
      );
      await initialCase.update(
        { status: CASE_STATUS.LETTER_IN_PROGRESS },
        { auditUser: "someone" }
      );
      await initialCase.update(
        { status: CASE_STATUS.READY_FOR_REVIEW },
        { auditUser: "someone" }
      );

      const request = httpMocks.createRequest({
        method: "PUT",
        params: {
          caseId: initialCase.id
        },
        body: {
          status: CASE_STATUS.FORWARDED_TO_AGENCY
        },
        nickname: "someone",
        permissions: [`${USER_PERMISSIONS.UPDATE_ALL_CASE_STATUSES}`]
      });

      await changeStatus(request, response, next);

      await initialCase.reload();

      expect(initialCase.status).toEqual(CASE_STATUS.FORWARDED_TO_AGENCY);
    });

    test("should update case status from forwarded to agency to closed", async () => {
      await initialCase.update(
        { status: CASE_STATUS.ACTIVE },
        { auditUser: "someone" }
      );
      await initialCase.update(
        { status: CASE_STATUS.LETTER_IN_PROGRESS },
        { auditUser: "someone" }
      );
      await initialCase.update(
        { status: CASE_STATUS.READY_FOR_REVIEW },
        { auditUser: "someone" }
      );
      await initialCase.update(
        { status: CASE_STATUS.FORWARDED_TO_AGENCY },
        { auditUser: "someone" }
      );

      const request = httpMocks.createRequest({
        method: "PUT",
        params: {
          caseId: initialCase.id
        },
        body: {
          status: CASE_STATUS.CLOSED
        },
        nickname: "someone",
        permissions: [`${USER_PERMISSIONS.UPDATE_ALL_CASE_STATUSES}`]
      });

      await changeStatus(request, response, next);
      await initialCase.reload();
      expect(initialCase.status).toEqual(CASE_STATUS.CLOSED);
    });
  });

  describe("User does not have permissions", async () => {
    test("should not update case status and should call error when only update_case_status permission is not present", async () => {
      const request = httpMocks.createRequest({
        method: "PUT",
        params: {
          caseId: initialCase.id
        },
        body: {
          status: CASE_STATUS.FORWARDED_TO_AGENCY
        },
        nickname: "someone",
        permissions: []
      });

      await initialCase.update(
        { status: CASE_STATUS.ACTIVE },
        { auditUser: "someone" }
      );
      await initialCase.update(
        { status: CASE_STATUS.LETTER_IN_PROGRESS },
        { auditUser: "someone" }
      );
      await initialCase.update(
        { status: CASE_STATUS.READY_FOR_REVIEW },
        { auditUser: "someone" }
      );

      await changeStatus(request, response, next);

      await initialCase.reload();

      expect(next).toBeCalledWith(
        Boom.badRequest(BAD_REQUEST_ERRORS.PERMISSIONS_MISSING_TO_UPDATE_STATUS)
      );
    });

    test("should not update case status for closed status and should call error when only update_case_status permission is not present", async () => {
      await initialCase.update(
        { status: CASE_STATUS.ACTIVE },
        { auditUser: "someone" }
      );
      await initialCase.update(
        { status: CASE_STATUS.LETTER_IN_PROGRESS },
        { auditUser: "someone" }
      );
      await initialCase.update(
        { status: CASE_STATUS.READY_FOR_REVIEW },
        { auditUser: "someone" }
      );
      await initialCase.update(
        { status: CASE_STATUS.FORWARDED_TO_AGENCY },
        { auditUser: "someone" }
      );

      const request = httpMocks.createRequest({
        method: "PUT",
        params: {
          caseId: initialCase.id
        },
        body: {
          status: CASE_STATUS.CLOSED
        },
        nickname: "someone",
        permissions: []
      });

      await changeStatus(request, response, next);
      await initialCase.reload();

      expect(next).toBeCalledWith(
        Boom.badRequest(BAD_REQUEST_ERRORS.PERMISSIONS_MISSING_TO_UPDATE_STATUS)
      );
    });
  });
});
