const { Op } = require("sequelize");
const models = require("../../../policeDataManager/models");

const buildOfficerAttributesForUnknownOfficer = async () => {
  let personType = await models.personType.findOne({
    where: { key: { [Op.like]: "%UNKNOWN%" } },
    attributes: ["key"]
  });
  return {
    ...models.case_officer.build().emptyCaseOfficerAttributes(),
    personTypeKey: personType?.key
  };
};

const buildOfficerAttributesForNewOfficer = async (
  officerId,
  caseEmployeeType,
  phoneNumber,
  email
) => {
  const newOfficer = await models.officer.findByPk(officerId, {
    include: [{ model: models.district, as: "officerDistrict" }]
  });
  let personType;
  let personTypes = await models.personType.findAll({
    where: { employeeDescription: caseEmployeeType },
    attributes: ["key", "employeeDescription"]
  });
  if (personTypes.length > 1) {
    personType = personTypes.find(type => !type.key.includes("UNKNOWN"))?.key;
  } else if (!personTypes.length) {
    personType = null;
  } else {
    personType = personTypes[0]?.key;
  }

  let initialAttributes = await buildOfficerAttributesForUnknownOfficer();
  let supervisorAttributes = await buildSupervisorAttributes(newOfficer);

  return Object.assign(
    initialAttributes,
    {
      officerId: newOfficer.id,
      firstName: newOfficer.firstName,
      middleName: newOfficer.middleName,
      lastName: newOfficer.lastName,
      windowsUsername: newOfficer.employeeId,
      bureau: newOfficer.bureau,
      rank: newOfficer.rank,
      race: newOfficer.race,
      district: newOfficer.officerDistrict && newOfficer.officerDistrict.name,
      sex: newOfficer.sex,
      dob: newOfficer.dob,
      endDate: newOfficer.endDate,
      hireDate: newOfficer.hireDate,
      caseEmployeeType: caseEmployeeType,
      phoneNumber: phoneNumber,
      email: email,
      employeeType: newOfficer.employeeType,
      workStatus: newOfficer.workStatus,
      supervisorWindowsUsername: newOfficer.supervisorEmployeeId,
      personTypeKey: personType
    },
    supervisorAttributes
  );
};

const buildSupervisorAttributes = async newOfficer => {
  if (!newOfficer.supervisorEmployeeId) {
    return {};
  }

  const supervisor = await models.officer.findOne({
    where: { employeeId: newOfficer.supervisorEmployeeId }
  });

  return {
    supervisorFirstName: supervisor?.firstName,
    supervisorMiddleName: supervisor?.middleName,
    supervisorLastName: supervisor?.lastName,
    supervisorWindowsUsername: supervisor?.supervisorEmployeeId
  };
};

module.exports = {
  buildOfficerAttributesForUnknownOfficer,
  buildOfficerAttributesForNewOfficer
};
