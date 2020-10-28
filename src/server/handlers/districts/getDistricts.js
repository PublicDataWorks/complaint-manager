import asyncMiddleware from "../asyncMiddleware";
import models from "../../policeDataManager/models";

const getDistricts = asyncMiddleware(async (request, response, next) => {
  const districtValues = await getSortedDistricts();
  response.status(200).send(districtValues);
});

const getSortedDistricts = async () => {
  let districts = await models.district.findAll({
    attributes: ["name", "id"],
    raw: true
  });
  const districtValues = districts.map(district => {
    return [district.name, district.id];
  });
  return sortDistricts(districtValues);
};

const sortDistricts = districtValues => {
  let splitDistrictValues = splitDistrictValuesByDistrictNumber(districtValues);
  splitDistrictValues.sort(compareDistricts);
  return joinSplitDistrictValueNames(splitDistrictValues);
};

const compareDistricts = (a, b) => {
  if (parseInt(a[0][0]) < parseInt(b[0][0])) return -1;
  if (parseInt(a[0][0]) > parseInt(b[0][0])) return 1;
  return 0;
};

const splitDistrictValuesByDistrictNumber = districtValues => {
  return districtValues.map(districtValue => {
    return [districtValue[0].split(/(\d+)/g).filter(Boolean), districtValue[1]];
  });
};

const joinSplitDistrictValueNames = splitDistrictValues => {
  return splitDistrictValues.map(splitDistrictValue => {
    return [splitDistrictValue[0].join("", ","), splitDistrictValue[1]];
  });
};

export default getDistricts;
