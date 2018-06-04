import Officer from "../../../../client/testUtilities/Officer";
import CaseOfficer from "../../../../client/testUtilities/caseOfficer";
import models from "../../../models";
import Case from "../../../../client/testUtilities/case";
import httpMocks from "node-mocks-http";
import editCaseOfficer from "./editCaseOfficer";
import { ACCUSED, WITNESS } from "../../../../sharedUtilities/constants";

describe("editCaseOfficer", () => {
  afterEach(async () => {
    await models.address.destroy({ truncate: true, cascade: true });
    await models.case_officer.destroy({
      truncate: true,
      cascade: true,
      force: true,
      auditUser: "someone"
    });
    await models.cases.destroy({
      truncate: true,
      force: true,
      cascade: true,
      auditUser: "test user"
    });
    await models.officer.destroy({ truncate: true, cascade: true });
    await models.data_change_audit.truncate();
  });

  let existingCase;
  beforeEach(async () => {
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
    let existingCaseOfficerAttributes, existingCaseOfficer;

    beforeEach(async () => {
      const existingOfficerAttributes = new Officer.Builder()
        .defaultOfficer()
        .withId(undefined)
        .withOfficerNumber(200)
        .withHireDate("2018-01-12")
        .build();
      const existingOfficer = await models.officer.create(
        existingOfficerAttributes
      );
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
        nickname: 'someone'
      });
      const response = httpMocks.createResponse();

      await editCaseOfficer(request, response, jest.fn());

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
        nickname: 'someone'
      });
      const response = httpMocks.createResponse();

      await editCaseOfficer(request, response, jest.fn());

      const updatedCaseOfficer = await models.case_officer.findById(
        existingCaseOfficerAttributes.id
      );
      expect(updatedCaseOfficer.notes).toEqual(fieldsToUpdate.notes);
      expect(updatedCaseOfficer.roleOnCase).toEqual(fieldsToUpdate.roleOnCase);
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
      const response = httpMocks.createResponse();

      await editCaseOfficer(request, response, jest.fn());

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
      const response = httpMocks.createResponse();

      await editCaseOfficer(request, response, jest.fn());
      await existingCaseOfficer.reload();

      expect(existingCaseOfficer.officerId).toEqual(null);
      expect(existingCaseOfficer.firstName).toEqual(null);
      expect(existingCaseOfficer.lastName).toEqual(null);
      expect(existingCaseOfficer.roleOnCase).toEqual(fieldsToUpdate.roleOnCase);
      expect(existingCaseOfficer.notes).toEqual(fieldsToUpdate.notes);
    });
  });

  test("updates unknown officer to known officer", async () => {
    const existingCaseOfficer = await models.case_officer.create({
      officerId: null,
      caseId: existingCase.id,
      roleOnCase: ACCUSED
    }, {auditUser: 'someone'});

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
    const response = httpMocks.createResponse();

    await editCaseOfficer(request, response, jest.fn());
    await existingCaseOfficer.reload();

    expect(existingCaseOfficer.officerId).toEqual(createdNewOfficer.id);
    expect(existingCaseOfficer.roleOnCase).toEqual(ACCUSED);
    expect(existingCaseOfficer.firstName).toEqual(createdNewOfficer.firstName);
    expect(existingCaseOfficer.lastName).toEqual(createdNewOfficer.lastName);
  });
});
