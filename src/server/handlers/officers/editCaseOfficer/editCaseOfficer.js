const models = require("../../../models");
const asyncMiddleware = require("../../asyncMiddleware");
const getCaseWithAllAssociations = require("../../getCaseWithAllAssociations");

const editCaseOfficer = asyncMiddleware(async (request, response, next) => {
  const { officerId, notes, roleOnCase } = request.body;
  const caseOfficerToUpdate = await models.case_officer.findOne({
    where: {
      id: request.params.caseOfficerId
    }
  });

  let officerAttributes = {};
  if (!officerId) {
    officerAttributes = buildOfficerAttributesForUnknownOfficer();
  } else if (officerId !== caseOfficerToUpdate.officerId) {
    officerAttributes = await buildOfficerAttributesForNewOfficer(officerId);
  }

  await models.case_officer.update(
    {
      notes,
      roleOnCase,
      ...officerAttributes
    },
    {
      where: {
        id: request.params.caseOfficerId
      },
      auditUser: request.nickname
    }
  );

  const updatedCase = await getCaseWithAllAssociations(request.params.caseId);
  response.status(200).send(updatedCase);
});

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

module.exports = editCaseOfficer;
