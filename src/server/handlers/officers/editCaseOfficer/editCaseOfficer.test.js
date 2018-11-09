import Officer from "../../../../client/testUtilities/Officer";
import CaseOfficer from "../../../../client/testUtilities/caseOfficer";
import models from "../../../models";
import Case from "../../../../client/testUtilities/case";
import httpMocks from "node-mocks-http";
import editCaseOfficer from "./editCaseOfficer";
import {
  ACCUSED,
  COMPLAINANT,
  WITNESS,
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  AUDIT_TYPE
} from "../../../../sharedUtilities/constants";
import Boom from "boom";
import OfficerAllegation from "../../../../client/testUtilities/OfficerAllegation";
import Allegation from "../../../../client/testUtilities/Allegation";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import LetterOfficer from "../../../../client/testUtilities/LetterOfficer";

describe("editCaseOfficer", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  let existingCase, next, response;
  beforeEach(async () => {
    next = jest.fn();
    response = httpMocks.createResponse();
    const existingCaseAttributes = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withAccusedOfficers([])
      .withIncidentLocation(undefined)
      .build();

    existingCase = await models.cases.create(existingCaseAttributes, {
      auditUser: "someone"
    });
  });

  describe("starting with known officer", function() {
    let existingCaseOfficerAttributes, existingCaseOfficer, existingOfficer;

    beforeEach(async () => {
      const existingOfficerAttributes = new Officer.Builder()
        .defaultOfficer()
        .withFirstName("Brandon")
        .withId(undefined)
        .withOfficerNumber(200)
        .withHireDate("2018-01-12")
        .build();

      existingOfficer = await models.officer.create(existingOfficerAttributes);
      existingCaseOfficerAttributes = new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withOfficerAttributes(existingOfficer)
        .withCaseId(existingCase.dataValues.id)
        .build();

      existingCaseOfficer = await models.case_officer.create(
        existingCaseOfficerAttributes,
        { auditUser: "someone" }
      );
    });

    test("it updates case officer with a different officer", async () => {
      const newOfficer = new Officer.Builder()
        .defaultOfficer()
        .withFirstName("Garret")
        .withMiddleName("Bobby")
        .withLastName("Freezer")
        .withWindowsUsername(87654)
        .withId(undefined)
        .withHireDate("2008-01-12")
        .withOfficerNumber(201)
        .build();
      const createdNewOfficer = await models.officer.create(newOfficer);
      const fieldsToUpdate = {
        officerId: createdNewOfficer.id,
        roleOnCase: existingCaseOfficerAttributes.roleOnCase
      };

      const request = httpMocks.createRequest({
        method: "PUT",
        headers: {
          authorization: "Bearer SOME_MOCK_TOKEN"
        },
        body: fieldsToUpdate,
        params: {
          caseId: existingCase.id,
          caseOfficerId: existingCaseOfficer.id
        },
        nickname: "someone"
      });

      await editCaseOfficer(request, response, next);

      const updatedCaseOfficer = await models.case_officer.findById(
        existingCaseOfficer.id
      );

      expect(updatedCaseOfficer.officerId).toEqual(createdNewOfficer.id);
      expect(updatedCaseOfficer.firstName).toEqual(createdNewOfficer.firstName);
      expect(updatedCaseOfficer.middleName).toEqual(
        createdNewOfficer.middleName
      );
      expect(updatedCaseOfficer.lastName).toEqual(createdNewOfficer.lastName);
      expect(updatedCaseOfficer.fullName).toEqual(createdNewOfficer.fullName);
      expect(updatedCaseOfficer.windowsUsername).toEqual(
        createdNewOfficer.windowsUsername
      );
    });

    test("updates notes and role on case", async () => {
      const fieldsToUpdate = {
        officerId: existingCaseOfficerAttributes.officerId,
        notes: "some notes",
        roleOnCase: WITNESS
      };

      const request = httpMocks.createRequest({
        method: "PUT",
        headers: {
          authorization: "Bearer SOME_MOCK_TOKEN"
        },
        body: fieldsToUpdate,
        params: {
          caseId: existingCase.id,
          caseOfficerId: existingCaseOfficer.id
        },
        nickname: "someone"
      });

      await editCaseOfficer(request, response, next);

      const updatedCaseOfficer = await models.case_officer.findById(
        existingCaseOfficerAttributes.id
      );
      expect(updatedCaseOfficer.notes).toEqual(fieldsToUpdate.notes);
      expect(updatedCaseOfficer.roleOnCase).toEqual(fieldsToUpdate.roleOnCase);
    });

    test("raise error if update fails", async () => {
      const fieldsToUpdate = {
        officerId: existingCaseOfficerAttributes.officerId,
        notes: "some notes",
        roleOnCase: null
      };

      const request = httpMocks.createRequest({
        method: "PUT",
        headers: {
          authorization: "Bearer SOME_MOCK_TOKEN"
        },
        body: fieldsToUpdate,
        params: {
          caseId: existingCase.id,
          caseOfficerId: existingCaseOfficer.id
        },
        nickname: "someone"
      });

      await editCaseOfficer(request, response, next);
      expect(next).toHaveBeenCalledWith(
        Boom.badImplementation(
          "notNull Violation: case_officer.roleOnCase cannot be null"
        )
      );

      const updatedCaseOfficer = await models.case_officer.findById(
        existingCaseOfficerAttributes.id
      );
      expect(updatedCaseOfficer.notes).toEqual(existingCaseOfficer.notes);
      expect(updatedCaseOfficer.roleOnCase).toEqual(
        existingCaseOfficer.roleOnCase
      );
    });

    test("does not change officer when officer id is the same as before", async () => {
      const fieldsToUpdate = {
        officerId: existingCaseOfficerAttributes.officerId,
        notes: existingCaseOfficerAttributes.notes,
        roleOnCase: existingCaseOfficerAttributes.roleOnCase
      };

      const request = httpMocks.createRequest({
        method: "PUT",
        headers: {
          authorization: "Bearer SOME_MOCK_TOKEN"
        },
        body: fieldsToUpdate,
        params: {
          caseId: existingCase.id,
          caseOfficerId: existingCaseOfficer.id
        },
        nickname: "someone"
      });

      await editCaseOfficer(request, response, next);

      const updatedCaseOfficer = await models.case_officer.findById(
        existingCaseOfficerAttributes.id
      );
      expect(updatedCaseOfficer.id).toEqual(existingCaseOfficer.id);
      expect(updatedCaseOfficer.firstName).toEqual(
        existingCaseOfficer.firstName
      );
      expect(updatedCaseOfficer.lastName).toEqual(existingCaseOfficer.lastName);
    });

    test("updates known officer to unknown officer", async () => {
      const fieldsToUpdate = {
        officerId: null,
        roleOnCase: existingCaseOfficerAttributes.roleOnCase,
        notes: existingCaseOfficerAttributes.notes
      };

      const request = httpMocks.createRequest({
        method: "PUT",
        headers: {
          authorization: "Bearer SOME_MOCK_TOKEN"
        },
        body: fieldsToUpdate,
        params: {
          caseId: existingCase.id,
          caseOfficerId: existingCaseOfficer.id
        },
        nickname: "someone"
      });

      await editCaseOfficer(request, response, next);
      await existingCaseOfficer.reload();

      expect(existingCaseOfficer.officerId).toEqual(null);
      expect(existingCaseOfficer.firstName).toEqual(null);
      expect(existingCaseOfficer.lastName).toEqual(null);
      expect(existingCaseOfficer.roleOnCase).toEqual(fieldsToUpdate.roleOnCase);
      expect(existingCaseOfficer.notes).toEqual(fieldsToUpdate.notes);
    });

    test("it updates case officer with a different officer with a supervisor", async () => {
      const supervisorAttributes = new Officer.Builder()
        .defaultOfficer()
        .withFirstName("Super")
        .withMiddleName("G")
        .withLastName("Visor")
        .withWindowsUsername(27705)
        .withId(undefined)
        .withOfficerNumber(444)
        .build();
      const supervisor = await models.officer.create(supervisorAttributes, {
        returning: true
      });

      const newOfficerAttributes = new Officer.Builder()
        .defaultOfficer()
        .withFirstName("Garret")
        .withMiddleName("Bobby")
        .withLastName("Freezer")
        .withWindowsUsername(87654)
        .withId(undefined)
        .withOfficerNumber(201)
        .withSupervisor(supervisor)
        .build();
      const newOfficer = await models.officer.create(newOfficerAttributes, {
        returning: true
      });

      const fieldsToUpdate = {
        officerId: newOfficer.id,
        roleOnCase: existingCaseOfficerAttributes.roleOnCase
      };

      const request = httpMocks.createRequest({
        method: "PUT",
        headers: {
          authorization: "Bearer SOME_MOCK_TOKEN"
        },
        body: fieldsToUpdate,
        params: {
          caseId: existingCase.id,
          caseOfficerId: existingCaseOfficer.id
        },
        nickname: "someone"
      });

      await editCaseOfficer(request, response, next);

      const updatedCaseOfficer = await models.case_officer.findById(
        existingCaseOfficer.id
      );

      expect(updatedCaseOfficer.officerId).toEqual(newOfficer.id);
      expect(updatedCaseOfficer.firstName).toEqual(newOfficer.firstName);
      expect(updatedCaseOfficer.middleName).toEqual(newOfficer.middleName);
      expect(updatedCaseOfficer.lastName).toEqual(newOfficer.lastName);
      expect(updatedCaseOfficer.fullName).toEqual(newOfficer.fullName);
      expect(updatedCaseOfficer.windowsUsername).toEqual(
        newOfficer.windowsUsername
      );
      expect(updatedCaseOfficer.supervisorFirstName).toEqual(
        supervisor.firstName
      );
      expect(updatedCaseOfficer.supervisorMiddleName).toEqual(
        supervisor.middleName
      );
      expect(updatedCaseOfficer.supervisorLastName).toEqual(
        supervisor.lastName
      );
      expect(updatedCaseOfficer.supervisorWindowsUsername).toEqual(
        supervisor.windowsUsername
      );
    });

    test("it updates case officer with a different officer without a supervisor", async () => {
      const newOfficerAttributes = new Officer.Builder()
        .defaultOfficer()
        .withFirstName("Garret")
        .withMiddleName("Bobby")
        .withLastName("Freezer")
        .withWindowsUsername(87654)
        .withId(undefined)
        .withOfficerNumber(201)
        .withSupervisorOfficerNumber(null)
        .build();
      const newOfficer = await models.officer.create(newOfficerAttributes, {
        returning: true
      });

      const fieldsToUpdate = {
        officerId: newOfficer.id,
        roleOnCase: existingCaseOfficerAttributes.roleOnCase
      };

      const request = httpMocks.createRequest({
        method: "PUT",
        headers: {
          authorization: "Bearer SOME_MOCK_TOKEN"
        },
        body: fieldsToUpdate,
        params: {
          caseId: existingCase.id,
          caseOfficerId: existingCaseOfficer.id
        },
        nickname: "someone"
      });

      await editCaseOfficer(request, response, next);

      const updatedCaseOfficer = await models.case_officer.findById(
        existingCaseOfficer.id
      );

      expect(updatedCaseOfficer.officerId).toEqual(newOfficer.id);
      expect(updatedCaseOfficer.firstName).toEqual(newOfficer.firstName);
      expect(updatedCaseOfficer.middleName).toEqual(newOfficer.middleName);
      expect(updatedCaseOfficer.lastName).toEqual(newOfficer.lastName);
      expect(updatedCaseOfficer.fullName).toEqual(newOfficer.fullName);
      expect(updatedCaseOfficer.windowsUsername).toEqual(
        newOfficer.windowsUsername
      );
      expect(updatedCaseOfficer.supervisorFirstName).toEqual(null);
      expect(updatedCaseOfficer.supervisorMiddleName).toEqual(null);
      expect(updatedCaseOfficer.supervisorLastName).toEqual(null);
      expect(updatedCaseOfficer.supervisorWindowsUsername).toEqual(null);
    });

    test("it does not change the case officer attributes snapshot when editing notes or roleOnCase", async () => {
      const fieldsToUpdate = {
        officerId: existingCaseOfficer.officerId,
        notes: "a new note",
        roleOnCase: WITNESS
      };
      const request = httpMocks.createRequest({
        method: "PUT",
        headers: {
          authorization: "Bearer SOME_MOCK_TOKEN"
        },
        body: fieldsToUpdate,
        params: {
          caseId: existingCase.id,
          caseOfficerId: existingCaseOfficer.id
        },
        nickname: "someone"
      });

      await existingOfficer.update(
        { firstName: "Wilbert" },
        { auditUser: request.nickname }
      );

      await editCaseOfficer(request, response, next);

      await existingCaseOfficer.reload();

      expect(existingCaseOfficer.firstName).toEqual("Brandon");
    });

    test("should audit case details access when case officer edited", async () => {
      const fieldsToUpdate = {
        roleOnCase: WITNESS,
        notes: "some new notes"
      };

      const request = httpMocks.createRequest({
        method: "PUT",
        headers: {
          authorization: "Bearer SOME_MOCK_TOKEN"
        },
        body: fieldsToUpdate,
        params: {
          caseId: existingCase.id,
          caseOfficerId: existingCaseOfficer.id
        },
        nickname: "test user"
      });

      await editCaseOfficer(request, response, next);

      const actionAudit = await models.action_audit.find({
        where: { caseId: existingCase.id }
      });

      expect(actionAudit).toEqual(
        expect.objectContaining({
          user: "test user",
          subject: AUDIT_SUBJECT.CASE_DETAILS,
          caseId: existingCase.id,
          action: AUDIT_ACTION.DATA_ACCESSED,
          auditType: AUDIT_TYPE.DATA_ACCESS
        })
      );
    });
  });

  test("updates unknown officer to known officer", async () => {
    const existingCaseOfficer = await models.case_officer.create(
      {
        officerId: null,
        caseId: existingCase.id,
        roleOnCase: ACCUSED
      },
      { auditUser: "someone" }
    );

    const newOfficer = new Officer.Builder()
      .defaultOfficer()
      .withFirstName("Garret")
      .withMiddleName("Bobby")
      .withLastName("Freezer")
      .withWindowsUsername(87654)
      .withId(undefined)
      .withHireDate("2008-01-12")
      .withOfficerNumber(201)
      .build();

    const createdNewOfficer = await models.officer.create(newOfficer);

    const fieldsToUpdate = {
      officerId: createdNewOfficer.id,
      roleOnCase: ACCUSED
    };

    const request = httpMocks.createRequest({
      method: "PUT",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      body: fieldsToUpdate,
      params: {
        caseId: existingCase.id,
        caseOfficerId: existingCaseOfficer.id
      },
      nickname: "test user"
    });

    await editCaseOfficer(request, response, next);
    await existingCaseOfficer.reload();

    expect(existingCaseOfficer.officerId).toEqual(createdNewOfficer.id);
    expect(existingCaseOfficer.roleOnCase).toEqual(ACCUSED);
    expect(existingCaseOfficer.firstName).toEqual(createdNewOfficer.firstName);
    expect(existingCaseOfficer.lastName).toEqual(createdNewOfficer.lastName);
  });

  describe("changing officer role on case", () => {
    let existingCaseOfficerAttributes,
      existingCaseOfficer,
      existingOfficer,
      officerAllegationAttributes,
      existingComplainantCaseOfficer,
      existingWitnessCaseOfficer;

    beforeEach(async () => {
      const existingOfficerAttributes = new Officer.Builder()
        .defaultOfficer()
        .withFirstName("Brandon")
        .withId(undefined)
        .withOfficerNumber(200)
        .withHireDate("2018-01-12")
        .build();

      existingOfficer = await models.officer.create(existingOfficerAttributes);

      const existingComplainantOfficerAttributes = new Officer.Builder()
        .defaultOfficer()
        .withId(undefined)
        .withOfficerNumber(900);

      const existingComplainantOfficer = await models.officer.create(
        existingComplainantOfficerAttributes,
        { auditUser: "someone" }
      );

      const existingWitnessOfficerAttributes = new Officer.Builder()
        .defaultOfficer()
        .withId(undefined)
        .withOfficerNumber(500);

      const existingWitnessOfficer = await models.officer.create(
        existingWitnessOfficerAttributes,
        { auditUser: "someone" }
      );

      const caseOfficerId = 2;
      const allegationAttributes = new Allegation.Builder()
        .defaultAllegation()
        .withId(undefined)
        .build();

      const existingAllegation = await models.allegation.create(
        allegationAttributes
      );

      officerAllegationAttributes = new OfficerAllegation.Builder()
        .defaultOfficerAllegation()
        .withCaseOfficerId(caseOfficerId)
        .withAllegationId(existingAllegation.id)
        .build();

      existingCaseOfficerAttributes = new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withId(caseOfficerId)
        .withRoleOnCase(ACCUSED)
        .withOfficerAttributes(existingOfficer)
        .withOfficerAllegations(officerAllegationAttributes)
        .withCaseId(existingCase.dataValues.id)
        .build();

      existingCaseOfficer = await models.case_officer.create(
        existingCaseOfficerAttributes,
        {
          auditUser: "someone",
          include: [
            {
              model: models.officer_allegation,
              as: "allegations",
              auditUser: "someone"
            }
          ]
        }
      );

      const existingComplainantCaseOfficerAttributes = new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withId(undefined)
        .withOfficerId(existingComplainantOfficer.id)
        .withCaseId(existingCase.id)
        .withRoleOnCase(COMPLAINANT);

      existingComplainantCaseOfficer = await models.case_officer.create(
        existingComplainantCaseOfficerAttributes,
        { auditUser: "someone" }
      );

      const existingWitnessCaseOfficerAttributes = new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withId(undefined)
        .withOfficerId(existingWitnessOfficer.id)
        .withCaseId(existingCase.id)
        .withRoleOnCase(WITNESS);

      existingWitnessCaseOfficer = await models.case_officer.create(
        existingWitnessCaseOfficerAttributes,
        { auditUser: "someone" }
      );
    });

    test("should remove allegations when changing officer role from accused to complainant", async () => {
      const fieldsToUpdate = {
        roleOnCase: COMPLAINANT
      };

      const request = httpMocks.createRequest({
        method: "PUT",
        headers: {
          authorization: "Bearer SOME_MOCK_TOKEN"
        },
        body: fieldsToUpdate,
        params: {
          caseId: existingCase.id,
          caseOfficerId: existingCaseOfficer.id
        },
        nickname: "test user"
      });

      await editCaseOfficer(request, response, next);
      await existingCaseOfficer.reload();

      expect(existingCaseOfficer.allegations).toEqual([]);
    });

    test("should remove letter officer when changing officer role from accused to complainant", async () => {
      const letterOfficerAttributes = new LetterOfficer.Builder()
        .defaultLetterOfficer()
        .withId(undefined)
        .withCaseOfficerId(existingCaseOfficer.id);

      await models.letter_officer.create(letterOfficerAttributes, {
        auditUser: "someone"
      });

      const fieldsToUpdate = {
        roleOnCase: COMPLAINANT
      };

      const request = httpMocks.createRequest({
        method: "PUT",
        headers: {
          authorization: "Bearer SOME_MOCK_TOKEN"
        },
        body: fieldsToUpdate,
        params: {
          caseId: existingCase.id,
          caseOfficerId: existingCaseOfficer.id
        },
        nickname: "test user"
      });

      await editCaseOfficer(request, response, next);
      const updatedLetterOfficer = await models.letter_officer.findOne({
        where: { caseOfficerId: existingCaseOfficer.id }
      });

      expect(updatedLetterOfficer).toBeNull();
    });

    test("should remove allegations when changing officer role from accused to witness", async () => {
      const fieldsToUpdate = {
        roleOnCase: WITNESS
      };

      const request = httpMocks.createRequest({
        method: "PUT",
        headers: {
          authorization: "Bearer SOME_MOCK_TOKEN"
        },
        body: fieldsToUpdate,
        params: {
          caseId: existingCase.id,
          caseOfficerId: existingCaseOfficer.id
        },
        nickname: "test user"
      });

      await editCaseOfficer(request, response, next);
      await existingCaseOfficer.reload();

      expect(existingCaseOfficer.allegations).toEqual([]);
    });

    test("should remove letter officer when changing officer role from accused to witness", async () => {
      const letterOfficerAttributes = new LetterOfficer.Builder()
        .defaultLetterOfficer()
        .withId(undefined)
        .withCaseOfficerId(existingCaseOfficer.id);

      await models.letter_officer.create(letterOfficerAttributes, {
        auditUser: "someone"
      });

      const fieldsToUpdate = {
        roleOnCase: WITNESS
      };

      const request = httpMocks.createRequest({
        method: "PUT",
        headers: {
          authorization: "Bearer SOME_MOCK_TOKEN"
        },
        body: fieldsToUpdate,
        params: {
          caseId: existingCase.id,
          caseOfficerId: existingCaseOfficer.id
        },
        nickname: "test user"
      });

      await editCaseOfficer(request, response, next);
      const updatedLetterOfficer = await models.letter_officer.findOne({
        where: { caseOfficerId: existingCaseOfficer.id }
      });

      expect(updatedLetterOfficer).toBeNull();
    });

    test("should not remove allegations when not changing officer role from accused", async () => {
      const fieldsToUpdate = {
        roleOnCase: ACCUSED,
        notes: "some new notes"
      };

      const request = httpMocks.createRequest({
        method: "PUT",
        headers: {
          authorization: "Bearer SOME_MOCK_TOKEN"
        },
        body: fieldsToUpdate,
        params: {
          caseId: existingCase.id,
          caseOfficerId: existingCaseOfficer.id
        },
        nickname: "test user"
      });

      await editCaseOfficer(request, response, next);
      await existingCaseOfficer.reload();

      expect(existingCaseOfficer.allegations).toEqual([
        expect.objectContaining(officerAllegationAttributes)
      ]);
    });

    test("should not remove letter officer when not changing officer role from accused", async () => {
      const letterOfficerAttributes = new LetterOfficer.Builder()
        .defaultLetterOfficer()
        .withId(undefined)
        .withCaseOfficerId(existingCaseOfficer.id);

      const letterOfficer = await models.letter_officer.create(
        letterOfficerAttributes,
        { auditUser: "someone" }
      );

      const fieldsToUpdate = {
        roleOnCase: ACCUSED,
        notes: "some new notes"
      };

      const request = httpMocks.createRequest({
        method: "PUT",
        headers: {
          authorization: "Bearer SOME_MOCK_TOKEN"
        },
        body: fieldsToUpdate,
        params: {
          caseId: existingCase.id,
          caseOfficerId: existingCaseOfficer.id
        },
        nickname: "test user"
      });

      await editCaseOfficer(request, response, next);
      await letterOfficer.reload();

      expect(letterOfficer).not.toBeNull();
    });

    test("should not remove allegations when editing officer fails", async () => {
      const fieldsToUpdate = {
        roleOnCase: "invalid role",
        notes: "some new notes"
      };

      const request = httpMocks.createRequest({
        method: "PUT",
        headers: {
          authorization: "Bearer SOME_MOCK_TOKEN"
        },
        body: fieldsToUpdate,
        params: {
          caseId: existingCase.id,
          caseOfficerId: existingCaseOfficer.id
        },
        nickname: "test user"
      });

      await editCaseOfficer(request, response, next);
      await existingCaseOfficer.reload();

      expect(existingCaseOfficer.allegations).toEqual([
        expect.objectContaining(officerAllegationAttributes)
      ]);
    });

    test("should not remove letter officer when editing officer fails", async () => {
      const letterOfficerAttributes = new LetterOfficer.Builder()
        .defaultLetterOfficer()
        .withId(undefined)
        .withCaseOfficerId(existingCaseOfficer.id);

      const letterOfficer = await models.letter_officer.create(
        letterOfficerAttributes,
        { auditUser: "someone" }
      );

      const fieldsToUpdate = {
        roleOnCase: "invalid role",
        notes: "some new notes"
      };

      const request = httpMocks.createRequest({
        method: "PUT",
        headers: {
          authorization: "Bearer SOME_MOCK_TOKEN"
        },
        body: fieldsToUpdate,
        params: {
          caseId: existingCase.id,
          caseOfficerId: existingCaseOfficer.id
        },
        nickname: "test user"
      });

      await editCaseOfficer(request, response, next);
      await letterOfficer.reload();

      expect(letterOfficer).not.toBeNull();
    });

    test("should create letter officer when changing case officer role to accused from complainant", async () => {
      const fieldsToUpdate = {
        roleOnCase: ACCUSED
      };

      const request = httpMocks.createRequest({
        method: "PUT",
        headers: {
          authorization: "Bearer SOME_MOCK_TOKEN"
        },
        body: fieldsToUpdate,
        params: {
          caseId: existingCase.id,
          caseOfficerId: existingComplainantCaseOfficer.id
        },
        nickname: "test user"
      });

      await editCaseOfficer(request, response, next);
      const letterOfficer = await models.letter_officer.findOne({
        where: { caseOfficerId: existingComplainantCaseOfficer.id }
      });

      expect(letterOfficer).not.toBeNull();
    });

    test("should create letter officer when changing case officer role to accused from witness", async () => {
      const fieldsToUpdate = {
        roleOnCase: ACCUSED
      };

      const request = httpMocks.createRequest({
        method: "PUT",
        headers: {
          authorization: "Bearer SOME_MOCK_TOKEN"
        },
        body: fieldsToUpdate,
        params: {
          caseId: existingCase.id,
          caseOfficerId: existingWitnessCaseOfficer.id
        },
        nickname: "test user"
      });

      await editCaseOfficer(request, response, next);
      const letterOfficer = await models.letter_officer.findOne({
        where: { caseOfficerId: existingWitnessCaseOfficer.id }
      });

      expect(letterOfficer).not.toBeNull();
    });

    test("should not create letter officer when changing officer role to complainant", async () => {
      const fieldsToUpdate = {
        roleOnCase: COMPLAINANT,
        notes: "some new notes"
      };

      const request = httpMocks.createRequest({
        method: "PUT",
        headers: {
          authorization: "Bearer SOME_MOCK_TOKEN"
        },
        body: fieldsToUpdate,
        params: {
          caseId: existingCase.id,
          caseOfficerId: existingWitnessCaseOfficer.id
        },
        nickname: "test user"
      });

      await editCaseOfficer(request, response, next);
      const letterOfficer = await models.letter_officer.findOne({
        where: { caseOfficerId: existingWitnessCaseOfficer.id }
      });

      expect(letterOfficer).toBeNull();
    });

    test("should not create letter officer when changing officer role to witness", async () => {
      const fieldsToUpdate = {
        roleOnCase: WITNESS,
        notes: "some new notes"
      };

      const request = httpMocks.createRequest({
        method: "PUT",
        headers: {
          authorization: "Bearer SOME_MOCK_TOKEN"
        },
        body: fieldsToUpdate,
        params: {
          caseId: existingCase.id,
          caseOfficerId: existingComplainantCaseOfficer.id
        },
        nickname: "test user"
      });

      await editCaseOfficer(request, response, next);
      const letterOfficer = await models.letter_officer.findOne({
        where: { caseOfficerId: existingComplainantCaseOfficer.id }
      });

      expect(letterOfficer).toBeNull();
    });

    test("should not create letter officer when editing officer fails", async () => {
      const fieldsToUpdate = {
        roleOnCase: "invalid role",
        notes: "some new notes"
      };

      const request = httpMocks.createRequest({
        method: "PUT",
        headers: {
          authorization: "Bearer SOME_MOCK_TOKEN"
        },
        body: fieldsToUpdate,
        params: {
          caseId: existingCase.id,
          caseOfficerId: existingComplainantCaseOfficer.id
        },
        nickname: "test user"
      });

      await editCaseOfficer(request, response, next);
      const letterOfficer = await models.letter_officer.findOne({
        where: { caseOfficerId: existingComplainantCaseOfficer.id }
      });

      expect(letterOfficer).toBeNull();
    });
  });
});
