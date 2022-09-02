import Case from "../../../sharedTestHelpers/case";
import Address from "../../../sharedTestHelpers/Address";
import Civilian from "../../../sharedTestHelpers/civilian";
import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import {
  ADDRESSABLE_TYPE,
  AUDIT_SUBJECT,
  CASE_STATUS,
  MANAGER_TYPE,
  USER_PERMISSIONS
} from "../../../sharedUtilities/constants";
import { createTestCaseWithCivilian } from "../../testHelpers/modelMothers";
import auditDataAccess from "../audits/auditDataAccess";
import { expectedCaseAuditDetails } from "../../testHelpers/expectedAuditDetails";
import { seedStandardCaseStatuses } from "../../testHelpers/testSeeding";

const editCivilian = require("./editCivilian");
const models = require("../../policeDataManager/models/index");
const httpMocks = require("node-mocks-http");

jest.mock("../audits/auditDataAccess");

describe("editCivilian", () => {
  let response, next, statuses;

  beforeEach(async () => {
    response = httpMocks.createResponse();
    next = jest.fn();

    statuses = await seedStandardCaseStatuses();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  describe("editCivilian handler editing civilian with no address", () => {
    let existingCase;
    beforeEach(async () => {
      existingCase = await createTestCaseWithCivilian();
    });

    describe("auditing", () => {
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
            civilianId: existingCivilian.id
          },
          body: {
            address: {
              streetAddress: "123 Fleet Street",
              city: "Chicago"
            }
          },
          nickname: "TEST_USER_NICKNAME",
          permissions: USER_PERMISSIONS.VIEW_ANONYMOUS_DATA
        });

        await editCivilian(request, response, next);

        expect(auditDataAccess).toHaveBeenCalledWith(
          request.nickname,
          existingCase.id,
          MANAGER_TYPE.COMPLAINT,
          AUDIT_SUBJECT.CASE_DETAILS,
          expectedCaseAuditDetails,
          expect.anything()
        );
      });
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
          civilianId: existingCivilian.id
        },
        body: {
          address: {
            streetAddress: "123 Fleet Street",
            city: "Chicago"
          }
        },
        nickname: "TEST_USER_NICKNAME",
        permissions: USER_PERMISSIONS.VIEW_ANONYMOUS_DATA
      });
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
      expect(existingCase.statusId).toEqual(
        statuses.find(status => status.name === "Active").id
      );
    });

    test("should call next when missing civilian id", async () => {
      const request = httpMocks.createRequest({
        method: "PUT",
        body: {},
        nickname: "TEST_USER_NICKNAME"
      });

      const next = jest.fn();
      await editCivilian(request, response, next);

      expect(next).toHaveBeenCalledWith(expect.anything());

      await existingCase.reload();
      expect(existingCase.statusId).toEqual(
        statuses.find(status => status.name === "Initial").id
      );
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
        auditUser: "someone",
        permissions: USER_PERMISSIONS.VIEW_ANONYMOUS_DATA
      });
      existingCivilian = existingCase.dataValues.complainantCivilians[0];
      const address = new Address.Builder()
        .defaultAddress()
        .withAddressableId(existingCivilian.id)
        .withAddressableType(ADDRESSABLE_TYPE.CIVILIAN)
        .withCity(initalCity)
        .withId(undefined)
        .build();
      await existingCivilian.createAddress(address, { auditUser: "someone" });
      await existingCivilian.reload({ include: [models.address] });
    });

    test("should update, not create, an address when address ID given", async () => {
      const initialAddressCount = await models.address.count();
      const request = httpMocks.createRequest({
        method: "PUT",
        headers: {
          authorization: "Bearer SOME_MOCK_TOKEN"
        },
        params: {
          civilianId: existingCivilian.id
        },
        body: {
          address: {
            id: existingCivilian.address.id,
            streetAddress: "123 Fleet Street",
            city: "Chicago"
          }
        },
        nickname: "TEST_USER_NICKNAME",
        permissions: USER_PERMISSIONS.VIEW_ANONYMOUS_DATA
      });

      await editCivilian(request, response, next);

      const updatedAddressCount = await models.address.count();
      const updatedAddress = await models.address.findOne({
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
      expect(existingCase.statusId).toEqual(
        statuses.find(status => status.name === "Active").id
      );
    });

    test("should update civilian with correct properties", async () => {
      const request = httpMocks.createRequest({
        method: "PUT",
        headers: {
          authorization: "Bearer SOME_MOCK_TOKEN"
        },
        params: {
          civilianId: existingCivilian.id
        },
        body: {
          firstName: "Bob"
        },
        nickname: "TEST_USER_NICKNAME",
        permissions: USER_PERMISSIONS.VIEW_ANONYMOUS_DATA
      });

      await editCivilian(request, response, next);

      await existingCivilian.reload();
      expect(existingCivilian.firstName).toEqual("Bob");
      await existingCase.reload();
      expect(existingCase.statusId).toEqual(
        statuses.find(status => status.name === "Active").id
      );
    });

    test("should not update civilian address or case status if civilian update fails", async () => {
      const fieldsToUpdate = { address: { city: "San Jose" }, caseId: null };

      const request = httpMocks.createRequest({
        method: "PUT",
        headers: {
          authorization: "Bearer SOME_MOCK_TOKEN"
        },
        params: {
          civilianId: existingCivilian.id
        },
        body: fieldsToUpdate,
        nickname: "TEST_USER_NICKNAME",
        permissions: USER_PERMISSIONS.VIEW_ANONYMOUS_DATA
      });

      await editCivilian(request, response, next);
      await existingCivilian.reload({ include: [models.address] });
      await existingCase.reload();

      expect(existingCivilian.address.city).toEqual(initalCity);
    });

    test("should trim extra whitespace from fields: firstName, lastName", async () => {
      const request = httpMocks.createRequest({
        method: "PUT",
        headers: {
          authorization: "Bearer SOME_MOCK_TOKEN"
        },
        params: {
          civilianId: existingCivilian.id
        },
        body: {
          firstName: "      Test White-space ",
          lastName: "  O'Hare  "
        },
        nickname: "TEST_USER_NICKNAME",
        permissions: USER_PERMISSIONS.VIEW_ANONYMOUS_DATA
      });

      await editCivilian(request, response, next);

      await existingCivilian.reload();
      expect(existingCivilian.firstName).toEqual("Test White-space");
      expect(existingCivilian.lastName).toEqual("O'Hare");
    });
  });
});
