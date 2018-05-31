const models = require("../../../models/index");
const asyncMiddleware = require("../../asyncMiddleware");
const getCaseWithAllAssociations = require("../../getCaseWithAllAssociations");

const addCaseOfficer = asyncMiddleware(async (request, response, next) => {
  const retrievedCase = await models.cases.findById(request.params.caseId);
  let caseOfficerAttributes;
  if (request.body.officerId) {
    const caseOfficer = await models.officer.findById(request.body.officerId);

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
      employeeType: caseOfficer.employeeType,
      workStatus: caseOfficer.workStatus
    };
  } else {
    caseOfficerAttributes = {
      notes: request.body.notes,
      roleOnCase: request.body.roleOnCase
    };
  }

  const updatedCase = await models.sequelize.transaction(async t => {
    await retrievedCase.createAccusedOfficer(caseOfficerAttributes, {
      transaction: t
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
