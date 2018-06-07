import app from "../../server";
import Case from "../../../client/testUtilities/case";
import request from "supertest";
import Civilian from "../../../client/testUtilities/civilian";
import models from "../../models";
import path from "path";
import jwt from "jsonwebtoken";
import fs from "fs";
import Address from "../../../client/testUtilities/Address";

const config = require("../../config/config")[process.env.NODE_ENV];

function buildTokenWithPermissions(permissions, nickname) {
  const privateKeyPath = path.join(
    __dirname,
    "../../config",
    "test",
    "private.pem"
  );
  const cert = fs.readFileSync(privateKeyPath);

  const payload = {
    foo: "bar",
    scope: `${config.authentication.scope} ${permissions}`
  };
  payload[`${config.authentication.nicknameKey}`] = nickname;

  const options = {
    audience: config.authentication.audience,
    issuer: config.authentication.issuer,
    algorithm: config.authentication.algorithm
  };

  return jwt.sign(payload, cert, options);
}

describe("DELETE /cases/:caseId/civilian/:civilianId", () => {
  let token;

  beforeEach(async () => {
    token = buildTokenWithPermissions("", "some_nickname");
  });

  afterEach(async () => {
    await models.address.truncate({ force: true, auditUser: "test user" });
    await models.civilian.destroy({
      truncate: true,
      force: true,
      auditUser: "test user"
    });
    await models.cases.destroy({
      truncate: true,
      cascade: true,
      auditUser: "test user"
    });
    await models.data_change_audit.truncate();
  });

  test("should soft delete an existing civilian", async () => {
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
      .withAddressableType("civilian")
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
            status: "Active",
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
