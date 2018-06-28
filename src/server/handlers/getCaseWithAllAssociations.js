const models = require("../models");

const getCaseWithAllAssociations = async (caseId, transaction = null) => {
  return await models.cases.findById(caseId, {
    include: [
      {
        model: models.civilian,
        as: "complainantCivilians",
        include: [models.address]
      },
      {
        model: models.civilian,
        as: "witnessCivilians",
        include: [models.address]
      },
      {
        model: models.attachment
      },
      {
        model: models.address,
        as: "incidentLocation"
      },
      {
        model: models.case_officer,
        as: "accusedOfficers",
        include: [
          {
            model: models.officer_allegation,
            as: "allegations",
            include: [models.allegation]
          }
        ]
      },
      {
        model: models.case_officer,
        as: "complainantOfficers"
      },
      {
        model: models.case_officer,
        as: "witnessOfficers"
      }
    ],
    transaction: transaction,
    order: [
      [
        {
          model: models.case_officer,
          as: "accusedOfficers"
        },
        {
          model: models.officer_allegation,
          as: "allegations",
          include: [models.allegation]
        },
        "createdAt"
      ]
    ]
  });
};

module.exports = getCaseWithAllAssociations;
