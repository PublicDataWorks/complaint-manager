import models from "../../../models";
import _ from "lodash";
import {
  getFullDistrictName,
  getOrdinalDistrict
} from "../../../../sharedUtilities/convertDistrictToOrdinal";

const transformCasesDistrictToId = async (districts, cases, transaction) => {
  const districtNameToIdDictionary = {};
  districts.forEach(district => {
    districtNameToIdDictionary[district.name] = district.id;
  });

  for (let i = 0; i < cases.length; i++) {
    if (!cases[i].districtId && !_.isEmpty(cases[i].district)) {
      await updateDatabaseWithCorrectDistrictId(
        cases[i],
        districtNameToIdDictionary,
        transaction
      );
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
      await updateDatabaseWithCorrectDistrictName(
        cases[i],
        districtIdToNameDictionary,
        transaction
      );
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
