import models from "../complaintManager/models";
import _ from "lodash";
import {
  getFullDistrictName,
  getOrdinalDistrict
} from "../../sharedUtilities/convertDistrictToOrdinal";

const transformCasesDistrictToId = async (districts, cases, transaction) => {
  const districtNameToIdDictionary = {};
  districts.forEach(district => {
    districtNameToIdDictionary[district.name] = district.id;
  });

  for (let i = 0; i < cases.length; i++) {
    if (!cases[i].districtId && !_.isEmpty(cases[i].district)) {
      try {
        await updateDatabaseWithCorrectDistrictId(
          cases[i],
          districtNameToIdDictionary,
          transaction
        );
      } catch (error) {
        throw new Error(
          `Error while transforming district to district id for case with id ${cases[i].id}. \nInternal Error: ${error}`
        );
      }
    }
  }
};

const updateDatabaseWithCorrectDistrictId = async (
  currentCase,
  districtNameToIdDictionary,
  transaction
) => {
  const correctedDistrictName = getOrdinalDistrict(currentCase.district);

  await currentCase.update(
    {
      districtId: districtNameToIdDictionary[correctedDistrictName],
      district: null
    },
    {
      include: [{ model: models.district, as: "caseDistrict" }],
      auditUser: "Katmai"
    }
  );
};

export const revertTransformCasesDistrictToId = async (
  districts,
  cases,
  transaction
) => {
  const districtIdToNameDictionary = {};
  districts.forEach(district => {
    districtIdToNameDictionary[district.id] = district.name;
  });

  for (let i = 0; i < cases.length; i++) {
    if (cases[i].districtId) {
      try {
        await updateDatabaseWithCorrectDistrictName(
          cases[i],
          districtIdToNameDictionary,
          transaction
        );
      } catch (error) {
        throw new Error(
          `Error while reverting district id to district for case with id ${cases[i].id}. \nInternal Error: ${error}`
        );
      }
    }
  }
};

const updateDatabaseWithCorrectDistrictName = async (
  currentCase,
  districtIdToNameDictionary,
  transaction
) => {
  const ordinalDistrict = districtIdToNameDictionary[currentCase.districtId];
  const districtFullName = getFullDistrictName(ordinalDistrict);

  await currentCase.update(
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

export default transformCasesDistrictToId;
