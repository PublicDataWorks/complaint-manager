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
    const caseOfficer = await models.officer.findById(officerId);

    let supervisorFirstName = null;
    let supervisorMiddleName = null;
    let supervisorLastName = null;
    let supervisorWindowsUsername = null;

    if (caseOfficer.supervisorOfficerNumber) {
      const supervisor = await models.officer.findOne({
        where: { officerNumber: caseOfficer.supervisorOfficerNumber }
      });

      supervisorFirstName = supervisor.firstName;
      supervisorMiddleName = supervisor.middleName;
      supervisorLastName = supervisor.lastName;
      supervisorWindowsUsername = supervisor.windowsUsername;
    }

    officerAttributes = {
      officerId: request.body.officerId,
      firstName: caseOfficer.firstName,
      middleName: caseOfficer.middleName,
      lastName: caseOfficer.lastName,
      windowsUsername: caseOfficer.windowsUsername,
      bureau: caseOfficer.bureau,
      rank: caseOfficer.rank,
      race: caseOfficer.race,
      district: caseOfficer.district,
      sex: caseOfficer.sex,
      dob: caseOfficer.dob,
      endDate: caseOfficer.endDate,
      hireDate: caseOfficer.hireDate,
      employeeType: caseOfficer.employeeType,
      workStatus: caseOfficer.workStatus,
      supervisorOfficerNumber: caseOfficer.supervisorOfficerNumber,
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
      }
    }
  );

  const updatedCase = await getCaseWithAllAssociations(request.params.caseId);
  response.status(200).send(updatedCase);
});

module.exports = editCaseOfficer;
