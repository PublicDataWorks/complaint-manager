const models = require("../../../models/index");
const asyncMiddleware = require("../../asyncMiddleware");
const getCaseWithAllAssociations = require("../../getCaseWithAllAssociations");

const addCaseOfficer = asyncMiddleware(async (request, response, next) => {
  const retrievedCase = await models.cases.findById(request.params.caseId);
  let caseOfficerAttributes;
  if (request.body.officerId) {
    const caseOfficer = await models.officer.findById(request.body.officerId);

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

    caseOfficerAttributes = {
      notes: request.body.notes,
      roleOnCase: request.body.roleOnCase,
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
  } else {
    caseOfficerAttributes = {
      notes: request.body.notes,
      roleOnCase: request.body.roleOnCase
    };
  }

  const updatedCase = await models.sequelize.transaction(async t => {
    //WORKS FOR WITNESS/COMPLAINANT
    await retrievedCase.createAccusedOfficer(caseOfficerAttributes, {
      transaction: t,
      auditUser: request.nickname
    });

    await models.cases.update(
      { status: "Active" },
      {
        where: {
          id: request.params.caseId
        },
        auditUser: request.nickname
      }
    );

    return await getCaseWithAllAssociations(retrievedCase.id, t);
  });

  return response.send(updatedCase);
});

module.exports = addCaseOfficer;
