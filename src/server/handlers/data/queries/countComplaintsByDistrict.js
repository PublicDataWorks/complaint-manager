import models from "../../../policeDataManager/models";
import sequelize from "sequelize";
import {
  ASCENDING,
  CASE_STATUS,
  DESCENDING
} from "../../../../sharedUtilities/constants";
import { calculateFirstContactDateCriteria } from "./queryHelperFunctions";
import { geoContains } from "d3-geo";

const {
  DISTRICTS_GEOJSON
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants.js`);

export const executeQuery = async (
  nickname,
  dateRange,
  filterCaseByStatus = [CASE_STATUS.FORWARDED_TO_AGENCY, CASE_STATUS.CLOSED]
) => {
  const geoPromise = getGeoData(dateRange);
  const districtIdWhere = {
    deletedAt: null,
    firstContactDate: calculateFirstContactDateCriteria(dateRange)
  };

  const districtIdQueryOptions = {
    attributes: [[sequelize.fn("COUNT", sequelize.col("*")), "count"]],
    include: [
      {
        model: models.district,
        as: "caseDistrict",
        attributes: ["name"],
        required: true
      },
      {
        model: models.caseStatus,
        as: "status",
        attributes: [],
        where: { name: filterCaseByStatus }
      }
    ],
    raw: true,
    group: "caseDistrict.name",
    where: districtIdWhere,
    order: [
      ["count", DESCENDING],
      [{ model: models.district, as: "caseDistrict" }, "name", ASCENDING]
    ]
  };

  const districtIdCount = await models.cases.findAll(districtIdQueryOptions);
  const geoCount = await geoPromise;

  districtIdCount.forEach(district => {
    if (geoCount[district["caseDistrict.name"]]) {
      geoCount[district["caseDistrict.name"]] += parseInt(district.count);
    } else {
      geoCount[district["caseDistrict.name"]] = parseInt(district.count);
    }
  });

  return Object.keys(geoCount)
    .map(district => ({
      district,
      count: geoCount[district]
    }))
    .sort((d1, d2) => {
      if (d1.count === d2.count) {
        return d1.district.localeCompare(d2.district);
      } else {
        return d2.count - d1.count;
      }
    });
};

const getGeoData = async dateRange => {
  if (!DISTRICTS_GEOJSON) {
    return {};
  }

  const geoWhere = {
    deletedAt: null,
    firstContactDate: calculateFirstContactDateCriteria(dateRange),
    district_id: null
  };

  const geoQueryOptions = {
    attributes: [],
    include: [
      {
        model: models.address,
        as: "incidentLocation",
        attributes: ["lat", "lng"],
        required: true
      },
      {
        model: models.caseStatus,
        as: "status",
        attributes: [],
        where: { name: [CASE_STATUS.FORWARDED_TO_AGENCY, CASE_STATUS.CLOSED] }
      }
    ],
    raw: true,
    where: geoWhere
  };

  const geoCount = await models.cases.findAll(geoQueryOptions);
  return geoCount.reduce((acc, loc) => {
    for (const district of DISTRICTS_GEOJSON.features) {
      if (
        geoContains(district, [
          loc["incidentLocation.lng"],
          loc["incidentLocation.lat"]
        ])
      ) {
        if (acc[district.properties.name]) {
          acc[district.properties.name]++;
        } else {
          acc[district.properties.name] = 1;
        }
        break;
      }
    }
    return acc;
  }, {});
};
