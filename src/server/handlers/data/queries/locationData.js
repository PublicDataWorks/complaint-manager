import models from "../../../policeDataManager/models";
import sequelize from "sequelize";

export const executeQuery = async fromDate => {
  const where = fromDate
    ? {
        deletedAt: null,
        firstContactDate: {
          [sequelize.Op.gte]: fromDate
        }
      }
    : { deletedAt: null };

  const queryOptions = {
    raw: true,
    where: where,
    attributes: [
      sequelize.col("incidentLocation.lat"),
      sequelize.col("incidentLocation.lng")
    ],
    include: [
      {
        model: models.address,
        attributes: ["lat", "lng"],
        as: "incidentLocation"
      }
    ]
  };

  const cases = await models.cases.findAll(queryOptions);
  return cases.map(c => ({
    lat: c["incidentLocation.lat"],
    lon: c["incidentLocation.lng"]
  }));
};
