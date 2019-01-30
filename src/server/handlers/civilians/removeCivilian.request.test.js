import app from "../../server";
import Case from "../../../client/testUtilities/case";
import request from "supertest";
import Civilian from "../../../client/testUtilities/civilian";
import models from "../../models";
import Address from "../../../client/testUtilities/Address";
import {
  buildTokenWithPermissions,
  cleanupDatabase
} from "../../testHelpers/requestTestHelpers";
import {
  ADDRESSABLE_TYPE,
  CASE_STATUS
} from "../../../sharedUtilities/constants";

describe("DELETE /cases/:caseId/civilians/:civilianId", () => {
  let token;

  beforeEach(async () => {
    token = buildTokenWithPermissions("", "some_nickname");
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  test("should delete a civilian even when they don't have an address", async () => {
    const civilianToCreate = new Civilian.Builder()
      .defaultCivilian()
      .withId(undefined)
      .withRoleOnCase("Complainant")
      .withCaseId(undefined)
      .withNoAddress()
      .build();

    const caseToCreate = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withIncidentLocation(undefined)
      .withComplainantCivilians([civilianToCreate])
      .build();

    const createdCase = await models.cases.create(caseToCreate, {
      include: [
        {
          model: models.civilian,
          as: "complainantCivilians",
          auditUser: "someone"
        }
      ],
      auditUser: "someone"
    });
    const createdCivilian = createdCase.complainantCivilians[0];

    await request(app)
      .delete(`/api/cases/${createdCase.id}/civilians/${createdCivilian.id}`)
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then(response => {
        expect(response.body).toEqual(
          expect.objectContaining({
            id: createdCase.id,
            status: CASE_STATUS.ACTIVE,
            complainantCivilians: []
          })
        );
      });
  });

  test("should soft delete an existing civilian that has an address", async () => {
    const civilian = new Civilian.Builder()
      .defaultCivilian()
      .withNoAddress()
      .withId(undefined)
      .withCaseId(undefined)
      .build();
    const exisitingCase = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withIncidentLocation(undefined)
      .withComplainantCivilians([civilian])
      .build();

    const createdCase = await models.cases.create(exisitingCase, {
      include: [
        {
          model: models.civilian,
          as: "complainantCivilians",
          auditUser: "someone"
        }
      ],
      auditUser: "someone"
    });
    const createdCivilian = createdCase.dataValues.complainantCivilians[0];
    const address = new Address.Builder()
      .defaultAddress()
      .withId(undefined)
      .withAddressableType(ADDRESSABLE_TYPE.CIVILIAN)
      .withAddressableId(createdCivilian.id)
      .build();
    await createdCivilian.createAddress(address, { auditUser: "someone" });
    await createdCivilian.reload({ include: [models.address] });

    await request(app)
      .delete(`/api/cases/${createdCase.id}/civilians/${createdCivilian.id}`)
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then(response => {
        expect(response.body).toEqual(
          expect.objectContaining({
            id: createdCase.id,
            status: CASE_STATUS.ACTIVE,
            complainantCivilians: []
          })
        );
      });

    //assert that address is not returned by find
    const civilianAddress = await models.address.findById(
      createdCivilian.address.id
    );
    expect(civilianAddress).toEqual(null);

    //assert that civilian is not returned by find
    const civilianInTable = await models.civilian.findById(createdCivilian.id);
    expect(civilianInTable).toEqual(null);

    //assert that civilian is still in table
    const softDeletedCivilianInTable = await models.civilian.findById(
      createdCivilian.id,
      {
        paranoid: false
      }
    );

    expect(softDeletedCivilianInTable).toBeDefined();
  });
});
