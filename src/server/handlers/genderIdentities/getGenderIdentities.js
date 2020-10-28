import asyncMiddleWare from "../asyncMiddleware";
import models from "../../policeDataManager/models";

const getGenderIdentities = asyncMiddleWare(async (request, response, next) => {
  const genderIdentities = await models.gender_identity.findAll({
    attributes: ["name", "id"],
    raw: true
  });
  const genderIdentityValues = genderIdentities.map(genderIdentity => {
    return [genderIdentity.name, genderIdentity.id];
  });

  response.status(200).send(genderIdentityValues);
});

export default getGenderIdentities;
