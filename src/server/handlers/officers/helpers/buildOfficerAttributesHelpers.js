const models = require("../../../policeDataManager/models");

const buildOfficerAttributesForUnknownOfficer = () => {
  return models.case_officer.build().emptyCaseOfficerAttributes();
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

  let initialAttributes = buildOfficerAttributesForUnknownOfficer();
  let supervisorAttributes = await buildSupervisorAttributes(newOfficer);

  return Object.assign(
    initialAttributes,
    {
      officerId: newOfficer.id,
      firstName: newOfficer.firstName,
      middleInitial: newOfficer.middleInitial,
      lastName: newOfficer.lastName,
      windowsUsername: newOfficer.windowsUsername,
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
      supervisorOfficerNumber: newOfficer.supervisorOfficerNumber
    },
    supervisorAttributes
  );
};

const buildSupervisorAttributes = async newOfficer => {
  if (!newOfficer.supervisorOfficerNumber) {
    return {};
  }

  const supervisor = await models.officer.findOne({
    where: { officerNumber: newOfficer.supervisorOfficerNumber }
  });

  return {
    supervisorFirstName: supervisor.firstName,
    supervisorMiddleInitial: supervisor.middleInitial,
    supervisorLastName: supervisor.lastName,
    supervisorWindowsUsername: supervisor.windowsUsername
  };
};

module.exports = {
  buildOfficerAttributesForUnknownOfficer,
  buildOfficerAttributesForNewOfficer
};
