import _ from "lodash";
import models from "../models";
import {
  getFullDistrictName,
  getOrdinalDistrict
} from "../../sharedUtilities/convertDistrictToOrdinal";

const transformOfficersDistrictToId = async (
  districts,
  officers,
  transaction
) => {
  const districtsDictionary = {};
  districts.forEach(district => {
    districtsDictionary[district.name] = district.id;
  });

  for (let i = 0; i < officers.length; i++) {
    if (!officers[i].districtId && !_.isEmpty(officers[i].district)) {
      try {
        await updateDatabaseWithCorrectDistrictId(
          officers[i],
          districtsDictionary,
          transaction
        );
      } catch (error) {
        throw new Error(
          `Error while transforming district to district id for officer with id ${officers[i].id}. \nInternal Error: ${error}`
        );
      }
    }
  }
};

const updateDatabaseWithCorrectDistrictId = async (
  officer,
  districtsDictionary,
  transaction
) => {
  const correctedDistrictName = getOrdinalDistrict(officer.district);

  await officer.update(
    {
      districtId: districtsDictionary[correctedDistrictName],
      district: null
    },
    {
      include: [{ model: models.district, as: "officerDistrict" }],
      auditUser: "Katmai"
    }
  );
};

export const revertTransformOfficersDistrictToId = async (
  districts,
  officers,
  transaction
) => {
  const districtIdToNameDictionary = {};
  districts.forEach(district => {
    districtIdToNameDictionary[district.id] = district.name;
  });

  for (let i = 0; i < officers.length; i++) {
    if (officers[i].districtId) {
      try {
        await updateDatabaseWithCorrectDistrictName(
          officers[i],
          districtIdToNameDictionary,
          transaction
        );
      } catch (error) {
        throw new Error(
          `Error while reverting district id to district for officer with id ${officers[i].id}. \nInternal Error: ${error}`
        );
      }
    }
  }
};

const updateDatabaseWithCorrectDistrictName = async (
  currentOfficer,
  districtIdToNameDictionary,
  transaction
) => {
  const ordinalDistrict = districtIdToNameDictionary[currentOfficer.districtId];
  const districtFullName = getFullDistrictName(ordinalDistrict);

  await currentOfficer.update(
    {
      districtId: null,
      district: districtFullName
    },
    {
      include: [{ model: models.district, as: "caseDistrict" }],
      auditUser: "Katmai"
    }
  );
};

export default transformOfficersDistrictToId;
