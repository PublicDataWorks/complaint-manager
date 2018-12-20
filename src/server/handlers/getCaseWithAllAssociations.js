const models = require("../models");

const getCaseWithAllAssociations = async (caseId, transaction = null) => {
  let caseDetails = await getCaseData(caseId, transaction);
  caseDetails = addPdfIsAvailable(caseDetails);
  return caseDetails;
};

const getCaseData = async (caseId, transaction) => {
  return await models.cases.findById(caseId, {
    include: [
      {
        model: models.classification
      },
      {
        model: models.intake_source,
        as: "intakeSource"
      },
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
      },
      {
        model: models.referral_letter,
        as: "referralLetter",
        attributes: ["finalPdfFilename"]
      }
    ],
    transaction: transaction,
    order: [
      [
        { model: models.case_officer, as: "accusedOfficers" },
        "createdAt",
        "ASC"
      ],
      [
        { model: models.civilian, as: "complainantCivilians" },
        "createdAt",
        "ASC"
      ],
      [
        { model: models.case_officer, as: "complainantOfficers" },
        "createdAt",
        "ASC"
      ]
    ]
  });
};

const addPdfIsAvailable = caseDetails => {
  caseDetails = caseDetails.toJSON();
  caseDetails.pdfAvailable = pdfIsAvailable(caseDetails.referralLetter);
  delete caseDetails.referralLetter;
  return caseDetails;
};

const pdfIsAvailable = referralLetter => {
  if (!referralLetter) {
    return false;
  }
  return referralLetter.finalPdfFilename !== null;
};

module.exports = getCaseWithAllAssociations;
