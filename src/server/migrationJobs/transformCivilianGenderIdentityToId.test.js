import models from "../policeDataManager/models";
import Civilian from "../../sharedTestHelpers/civilian";
import CaseStatus from "../../sharedTestHelpers/caseStatus";
import { createTestCaseWithoutCivilian } from "../testHelpers/modelMothers";
import { cleanupDatabase } from "../testHelpers/requestTestHelpers";
import {
  revertTransformCivilianGenderIdentityToId,
  transformCivilianGenderIdentityToId
} from "./transformCivilianGenderIdentityToId";

describe("transform civilian gender identity to ID", () => {
  const genderIdentityProperties = {
    other: {
      id: 1,
      name: "Other"
    },
    female: {
      id: 2,
      name: "Female"
    },
    transMale: {
      id: 3,
      name: "Trans Male"
    },
    transFemale: {
      id: 4,
      name: "Trans Female"
    }
  };

  let genderIdentities,
    testCivilians,
    civilianWithGenderIdentityIdOther,
    civilianWithGenderIdentityId2Female,
    civilianWithGenderIdentityStringTransMale,
    civilianWithGenderIdentityString2TransFemale,
    civilianWithoutGenderIdentity;

  const selectCiviliansQuery = "SELECT * from civilians;";

  const genderIdentityPropertiesArray = Object.keys(
    genderIdentityProperties
  ).map(function (genderIdentityKey) {
    return genderIdentityProperties[genderIdentityKey];
  });

  beforeEach(async () => {
    await cleanupDatabase();
    await models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "user" }
    );

    await models.gender_identity.bulkCreate(genderIdentityPropertiesArray, {
      auditUser: "test"
    });

    genderIdentities = await models.gender_identity.findAll();

    const existingCase = await createTestCaseWithoutCivilian();

    civilianWithGenderIdentityIdOther = await models.civilian.create(
      new Civilian.Builder()
        .defaultCivilian()
        .withId(undefined)
        .withFirstName(genderIdentityProperties.other.name)
        .withCaseId(existingCase.id)
        .withGenderIdentityId(genderIdentityProperties.other.id),
      { auditUser: "test" }
    );

    civilianWithGenderIdentityId2Female = await models.civilian.create(
      new Civilian.Builder()
        .defaultCivilian()
        .withFirstName(genderIdentityProperties.female.name)
        .withId(undefined)
        .withCaseId(existingCase.id)
        .withGenderIdentityId(genderIdentityProperties.female.id),
      { auditUser: "test" }
    );

    civilianWithGenderIdentityStringTransMale = await models.civilian.create(
      new Civilian.Builder()
        .defaultCivilian()
        .withFirstName(genderIdentityProperties.transMale.name)
        .withCaseId(existingCase.id)
        .withId(undefined),
      { auditUser: "test" }
    );

    civilianWithGenderIdentityString2TransFemale = await models.civilian.create(
      new Civilian.Builder()
        .defaultCivilian()
        .withFirstName(genderIdentityProperties.transFemale.name)
        .withCaseId(existingCase.id)
        .withId(undefined),
      { auditUser: "test" }
    );
    civilianWithoutGenderIdentity = await models.civilian.create(
      new Civilian.Builder()
        .defaultCivilian()
        .withCaseId(existingCase.id)
        .withId(undefined),
      { auditUser: "test" }
    );

    const updateCivilians =
      `UPDATE civilians SET gender_identity = '${genderIdentityProperties.transMale.name}', gender_identity_id = null WHERE id = ${civilianWithGenderIdentityStringTransMale.id};` +
      ` UPDATE civilians SET gender_identity = '${genderIdentityProperties.transFemale.name}', gender_identity_id = null WHERE id = ${civilianWithGenderIdentityString2TransFemale.id};`;

    await models.sequelize.query(updateCivilians, {
      type: models.sequelize.QueryTypes.UPDATE
    });

    testCivilians = await models.sequelize.query(selectCiviliansQuery, {
      type: models.sequelize.QueryTypes.SELECT
    });
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("should correctly get gender identity id from gender identity name", async () => {
    await models.sequelize.transaction(async transaction => {
      await transformCivilianGenderIdentityToId(
        genderIdentities,
        testCivilians,
        transaction
      );
    });

    const transformedCiviliansResult = await models.sequelize.query(
      selectCiviliansQuery,
      {
        type: models.sequelize.QueryTypes.SELECT
      }
    );

    expect(transformedCiviliansResult).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: civilianWithGenderIdentityIdOther.id,
          gender_identity_id: civilianWithGenderIdentityIdOther.genderIdentityId
        }),
        expect.objectContaining({
          id: civilianWithGenderIdentityId2Female.id,
          gender_identity_id:
            civilianWithGenderIdentityId2Female.genderIdentityId
        }),
        expect.objectContaining({
          id: civilianWithGenderIdentityStringTransMale.id,
          gender_identity_id: genderIdentityProperties.transMale.id
        }),
        expect.objectContaining({
          id: civilianWithGenderIdentityString2TransFemale.id,
          gender_identity_id: genderIdentityProperties.transFemale.id
        }),
        expect.objectContaining({
          id: civilianWithoutGenderIdentity.id,
          gender_identity_id: null
        })
      ])
    );
  });

  test("should correctly get gender identity string from gender identity id", async () => {
    await models.sequelize.transaction(async transaction => {
      await revertTransformCivilianGenderIdentityToId(
        genderIdentities,
        testCivilians,
        transaction
      );
    });

    const transformedCiviliansResult = await models.sequelize.query(
      selectCiviliansQuery,
      {
        type: models.sequelize.QueryTypes.SELECT
      }
    );

    expect(transformedCiviliansResult).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: civilianWithGenderIdentityIdOther.id,
          gender_identity: genderIdentityProperties.other.name
        }),
        expect.objectContaining({
          id: civilianWithGenderIdentityId2Female.id,
          gender_identity: genderIdentityProperties.female.name
        }),
        expect.objectContaining({
          id: civilianWithGenderIdentityStringTransMale.id,
          gender_identity: genderIdentityProperties.transMale.name
        }),
        expect.objectContaining({
          id: civilianWithGenderIdentityString2TransFemale.id,
          gender_identity: genderIdentityProperties.transFemale.name
        }),
        expect.objectContaining({
          id: civilianWithoutGenderIdentity.id,
          gender_identity: null
        })
      ])
    );
  });
});
