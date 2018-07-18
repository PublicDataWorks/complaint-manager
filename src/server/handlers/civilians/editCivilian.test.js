import Case from "../../../client/testUtilities/case";
import Address from "../../../client/testUtilities/Address";
import Civilian from "../../../client/testUtilities/civilian";
import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import {
  CASE_STATUS,
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  AUDIT_TYPE
} from "../../../sharedUtilities/constants";
import Boom from "boom";
import { createCaseWithCivilian } from "../../testHelpers/modelMothers";

const editCivilian = require("./editCivilian");
const models = require("../../models/index");
const httpMocks = require("node-mocks-http");

describe("editCivilian handler editing civilian with no address", () => {
  let existingCase;
  const next = jest.fn();
  afterEach(async () => {
    await cleanupDatabase();
  });
  beforeEach(async () => {
    existingCase = await createCaseWithCivilian();
  });

  test("should audit case details access when civilian edited", async () => {
    const existingCivilians = await existingCase.getComplainantCivilians({
      include: [models.address]
    });
    const existingCivilian = existingCivilians[0];
    const request = httpMocks.createRequest({
      method: "PUT",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        id: existingCivilian.id
      },
      body: {
        address: {
          streetAddress: "123 Fleet Street",
          city: "Chicago"
        }
      },
      nickname: "TEST_USER_NICKNAME"
    });
    const response = httpMocks.createResponse();
    await editCivilian(request, response, next);

    const actionAudit = await models.action_audit.find({
      where: { caseId: existingCase.id }
    });

    expect(actionAudit).toEqual(
      expect.objectContaining({
        caseId: existingCase.id,
        action: AUDIT_ACTION.DATA_ACCESSED,
        subject: AUDIT_SUBJECT.CASE_DETAILS,
        user: "TEST_USER_NICKNAME",
        auditType: AUDIT_TYPE.DATA_ACCESS
      })
    );
  });

  test("should create, not update, an address when no address ID given", async () => {
    const existingCivilians = await existingCase.getComplainantCivilians({
      include: [models.address]
    });
    const existingCivilian = existingCivilians[0];
    const initialAddressCount = await models.address.count();
    const request = httpMocks.createRequest({
      method: "PUT",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        id: existingCivilian.id
      },
      body: {
        address: {
          streetAddress: "123 Fleet Street",
          city: "Chicago"
        }
      },
      nickname: "TEST_USER_NICKNAME"
    });
    const response = httpMocks.createResponse();
    await editCivilian(request, response, next);
    await existingCivilian.reload();

    const updatedAddressCount = await models.address.count();

    expect(existingCivilian.address).toEqual(
      expect.objectContaining({
        streetAddress: "123 Fleet Street",
        city: "Chicago"
      })
    );
    expect(updatedAddressCount).toEqual(initialAddressCount + 1);
    await existingCase.reload();
    expect(existingCase.status).toEqual(CASE_STATUS.ACTIVE);
  });

  test("should call next when missing civilian id", async () => {
    const request = httpMocks.createRequest({
      method: "PUT",
      body: {},
      nickname: "TEST_USER_NICKNAME"
    });

    const response = httpMocks.createResponse();
    const next = jest.fn();
    await editCivilian(request, response, next);
    expect(next).toHaveBeenCalledWith(
      Boom.badImplementation("Cannot read property 'update' of null")
    );
    await existingCase.reload();
    expect(existingCase.status).toEqual(CASE_STATUS.INITIAL);
  });
});

describe("editCivilian handler editing civilian with an address", () => {
  let existingCase, existingCivilian;
  const initalCity = "Chicago";

  beforeEach(async () => {
    const civilianAttributes = new Civilian.Builder()
      .defaultCivilian()
      .withId(undefined)
      .withNoAddress()
      .withRoleOnCase("Complainant")
      .build();

    const caseAttributes = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withIncidentLocation(undefined)
      .withComplainantCivilians([civilianAttributes])
      .build();

    existingCase = await models.cases.create(caseAttributes, {
      include: [
        {
          model: models.civilian,
          as: "complainantCivilians",
          auditUser: "someone"
        }
      ],
      auditUser: "someone"
    });
    existingCivilian = existingCase.dataValues.complainantCivilians[0];
    const address = new Address.Builder()
      .defaultAddress()
      .withAddressableId(existingCivilian.id)
      .withAddressableType("civilian")
      .withCity(initalCity)
      .withId(undefined)
      .build();
    await existingCivilian.createAddress(address, { auditUser: "someone" });
    await existingCivilian.reload({ include: [models.address] });
  });

  afterEach(async () => {
    await models.address.truncate({ auditUser: "test user", force: true });
    await models.civilian.truncate({ auditUser: "test user" });
    await models.cases.truncate({
      cascade: true,
      force: true,
      auditUser: "test user"
    });
    await models.data_change_audit.truncate();
  });

  test("should update, not create, an address when address ID given", async () => {
    const initialAddressCount = await models.address.count();
    const request = httpMocks.createRequest({
      method: "PUT",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        id: existingCivilian.id
      },
      body: {
        address: {
          id: existingCivilian.address.id,
          streetAddress: "123 Fleet Street",
          city: "Chicago"
        }
      },
      nickname: "TEST_USER_NICKNAME"
    });
    const response = httpMocks.createResponse();

    await editCivilian(request, response, jest.fn());

    const updatedAddressCount = await models.address.count();
    const updatedAddress = await models.address.find({
      where: {
        id: existingCivilian.address.id
      }
    });
    expect(updatedAddress).toEqual(
      expect.objectContaining({
        streetAddress: "123 Fleet Street",
        city: "Chicago"
      })
    );
    expect(updatedAddressCount).toEqual(initialAddressCount);
    await existingCase.reload();
    expect(existingCase.status).toEqual(CASE_STATUS.ACTIVE);
  });

  test("should update civilian with correct properties", async () => {
    const request = httpMocks.createRequest({
      method: "PUT",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        id: existingCivilian.id
      },
      body: {
        firstName: "Bob"
      },
      nickname: "TEST_USER_NICKNAME"
    });
    const response = httpMocks.createResponse();

    await editCivilian(request, response, jest.fn());

    await existingCivilian.reload();
    expect(existingCivilian.firstName).toEqual("Bob");
    await existingCase.reload();
    expect(existingCase.status).toEqual(CASE_STATUS.ACTIVE);
  });

  test("should not update civilian address or case status if civilian update fails", async () => {
    const fieldsToUpdate = { address: { city: "San Jose" }, caseId: null };

    const request = httpMocks.createRequest({
      method: "PUT",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        id: existingCivilian.id
      },
      body: fieldsToUpdate,
      nickname: "TEST_USER_NICKNAME"
    });

    const response = httpMocks.createResponse();
    const next = jest.fn();
    await editCivilian(request, response, next);
    await existingCivilian.reload({ include: [models.address] });
    await existingCase.reload();

    expect(existingCivilian.address.city).toEqual(initalCity);
  });
});
