const models = require("../../models");

const buildOfficerAttributesForUnknownOfficer = () => {
  return models.case_officer.build().emptyCaseOfficerAttributes();
};

const buildOfficerAttributesForNewOfficer = async officerId => {
  const newOfficer = await models.officer.findById(officerId);

  let initialAttributes = buildOfficerAttributesForUnknownOfficer();
  let supervisorAttributes = await buildSupervisorAttributes(newOfficer);

  return Object.assign(
    initialAttributes,
    {
      officerId: newOfficer.id,
      firstName: newOfficer.firstName,
      middleName: newOfficer.middleName,
      lastName: newOfficer.lastName,
      windowsUsername: newOfficer.windowsUsername,
      bureau: newOfficer.bureau,
      rank: newOfficer.rank,
      race: newOfficer.race,
      district: newOfficer.district,
      sex: newOfficer.sex,
      dob: newOfficer.dob,
      endDate: newOfficer.endDate,
      hireDate: newOfficer.hireDate,
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
    supervisorMiddleName: supervisor.middleName,
    supervisorLastName: supervisor.lastName,
    supervisorWindowsUsername: supervisor.windowsUsername
  };
};

module.exports = {
  buildOfficerAttributesForUnknownOfficer,
  buildOfficerAttributesForNewOfficer
};
