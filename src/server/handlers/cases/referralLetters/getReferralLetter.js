const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../models/");

const getReferralLetter = asyncMiddleware(async (request, response) => {
  let letterData = await getLetterData(request.params.caseId);
  letterData = letterData.toJSON();

  for (let referralLetterOfficer of letterData.referralLetterOfficers) {
    referralLetterOfficer.fullName = referralLetterOfficer.caseOfficer.fullName;
    delete referralLetterOfficer.caseOfficer;
  }
  response.send(letterData);
});

const getLetterData = async caseId => {
  return await models.referral_letter.findOne({
    where: { caseId: caseId },
    attributes: ["id"],
    include: [
      {
        model: models.referral_letter_officer,
        as: "referralLetterOfficers",
        attributes: [
          "id",
          "caseOfficerId",
          "historicalBehaviorNotes",
          "numberHistoricalHighAllegations",
          "numberHistoricalMediumAllegations",
          "numberHistoricalLowAllegations"
        ],
        include: [
          {
            model: models.case_officer,
            as: "caseOfficer",
            attributes: ["officerId", "firstName", "middleName", "lastName"]
          },
          {
            model: models.referral_letter_officer_history_note,
            as: "referralLetterOfficerHistoryNotes",
            attributes: [
              "id",
              "referralLetterOfficerId",
              "pibCaseNumber",
              "details"
            ],
            separate: true
          }
        ]
      }
    ]
  });
};

module.exports = getReferralLetter;
