import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import { createCaseWithoutCivilian } from "../../../testHelpers/modelMothers";
import changeStatus from "./changeStatus";
import {
  CASE_STATUS,
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  AUDIT_TYPE,
  ACCUSED
} from "../../../../sharedUtilities/constants";
import httpMocks from "node-mocks-http";
import Boom from "boom";
import models from "../../../models/index";
import Officer from "../../../../client/testUtilities/Officer";
import CaseOfficer from "../../../../client/testUtilities/caseOfficer";

describe("changeStatus", async () => {
  let initialCase, response, next;

  beforeEach(async () => {
    initialCase = await createCaseWithoutCivilian();
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
        id: initialCase.id
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
        id: initialCase.id
      },
      body: {
        status: "BLAH"
      },
      nickname: "someone"
    });

    await changeStatus(request, response, next);
    await initialCase.reload();

    expect(next).toBeCalledWith(Boom.badRequest("Invalid case status"));
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
        id: initialCase.id
      },
      body: {
        status: CASE_STATUS.LETTER_IN_PROGRESS
      },
      nickname: "someone"
    });

    await changeStatus(request, response, next);

    const letterCreated = await models.referral_letter.find({
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
        id: initialCase.id
      },
      body: {
        status: CASE_STATUS.ACTIVE
      },
      nickname: "someone"
    });

    await changeStatus(request, response, next);

    const letterCreated = await models.referral_letter.find({
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
        id: initialCase.id
      },
      body: {
        status: CASE_STATUS.LETTER_IN_PROGRESS
      },
      nickname: "someone"
    });

    await changeStatus(request, response, next);

    const letterCreated = await models.referral_letter.find({
      where: { caseId: initialCase.id }
    });
    expect(letterCreated).toBeNull();

    await initialCase.reload();
    expect(initialCase.status).toEqual(CASE_STATUS.INITIAL);
    expect(next).toHaveBeenCalledWith(Boom.badRequest("Invalid case status"));
  });

  test("should call next with error if case not found", async () => {
    const request = httpMocks.createRequest({
      method: "PUT",
      params: {
        id: initialCase.id + 5
      },
      body: {
        status: CASE_STATUS.ACTIVE
      },
      nickname: "someone"
    });

    await changeStatus(request, response, next);
    await initialCase.reload();

    expect(next).toBeCalledWith(
      Boom.badRequest(`Case #${initialCase.id + 5} doesn't exist`)
    );
  });

  test("should audit case details", async () => {
    const newStatus = CASE_STATUS.ACTIVE;
    const request = httpMocks.createRequest({
      method: "PUT",
      params: {
        id: initialCase.id
      },
      body: {
        status: newStatus
      },
      nickname: "someone"
    });

    await changeStatus(request, response, next);

    const actionAudit = await models.action_audit.find({
      where: { caseId: initialCase.id }
    });

    expect(actionAudit).toEqual(
      expect.objectContaining({
        user: "someone",
        action: AUDIT_ACTION.DATA_ACCESSED,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        subject: AUDIT_SUBJECT.CASE_DETAILS,
        caseId: initialCase.id
      })
    );
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
          id: initialCase.id
        },
        body: {
          status: CASE_STATUS.LETTER_IN_PROGRESS
        },
        nickname: "someone"
      });

      await changeStatus(request, response, next);

      const letterOfficer1 = await models.letter_officer.find({
        where: { caseOfficerId: accusedCaseOfficer1.id }
      });

      const letterOfficer2 = await models.letter_officer.find({
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
          id: initialCase.id
        },
        body: {
          status: CASE_STATUS.ACTIVE
        },
        nickname: "someone"
      });

      await changeStatus(request, response, next);

      const letterOfficer1 = await models.letter_officer.find({
        where: { caseOfficerId: accusedCaseOfficer1.id }
      });

      const letterOfficer2 = await models.letter_officer.find({
        where: { caseOfficerId: accusedCaseOfficer2.id }
      });

      expect(letterOfficer1).toBeNull();
      expect(letterOfficer2).toBeNull();

      await initialCase.reload();
      expect(initialCase.status).toEqual(CASE_STATUS.ACTIVE);
    });
  });
});
