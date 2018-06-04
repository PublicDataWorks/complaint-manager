const models = require("../../../models");
const asyncMiddleware = require("../../asyncMiddleware");
const getCaseWithAllAssociations = require("../../getCaseWithAllAssociations");

const editCaseOfficer = asyncMiddleware(async (request, response, next) => {
  const { officerId, notes, roleOnCase } = request.body;
  let officerAttributes;
  const caseOfficerToUpdate = await models.case_officer.findOne({
    where: {
      id: request.params.caseOfficerId
    },
    returning: true
  });

  if (officerId && officerId !== caseOfficerToUpdate.officerId) {
    const newOfficer = await models.officer.findById(officerId);

    let supervisorFirstName = null;
    let supervisorMiddleName = null;
    let supervisorLastName = null;
    let supervisorWindowsUsername = null;

    if (newOfficer.supervisorOfficerNumber) {
      const supervisor = await models.officer.findOne({
        where: { officerNumber: newOfficer.supervisorOfficerNumber }
      });

      supervisorFirstName = supervisor.firstName;
      supervisorMiddleName = supervisor.middleName;
      supervisorLastName = supervisor.lastName;
      supervisorWindowsUsername = supervisor.windowsUsername;
    }

    officerAttributes = {
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
      supervisorOfficerNumber: newOfficer.supervisorOfficerNumber,
      supervisorFirstName,
      supervisorMiddleName,
      supervisorLastName,
      supervisorWindowsUsername
    };
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

module.exports = editCaseOfficer;
