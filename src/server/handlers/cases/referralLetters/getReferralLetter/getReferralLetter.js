const asyncMiddleware = require("../../../asyncMiddleware");
const models = require("../../../../models/index");
const shortid = require("shortid");

const getReferralLetter = asyncMiddleware(async (request, response) => {
  let letterData = await getLetterData(request.params.caseId);
  letterData = letterData.toJSON();

  const transformedLetterOfficerData = letterData.caseOfficers.map(
    caseOfficer => {
      return {
        caseOfficerId: caseOfficer.id,
        fullName: caseOfficer.fullName,
        ...letterOfficerAttributesWithNotes(caseOfficer)
      };
    }
  );
  const transformedLetterData = {
    id: letterData.id,
    caseId: letterData.caseId,
    referralLetterOfficers: transformedLetterOfficerData
  };

  response.send(transformedLetterData);
});

const letterOfficerAttributesWithNotes = caseOfficer => {
  const letterOfficerAttributes = caseOfficer.referralLetterOfficer || {};
  if (
    !letterOfficerAttributes.referralLetterOfficerHistoryNotes ||
    letterOfficerAttributes.referralLetterOfficerHistoryNotes.length === 0
  ) {
    letterOfficerAttributes.referralLetterOfficerHistoryNotes = buildEmptyNotes();
  }
  return letterOfficerAttributes;
};

const buildEmptyNotes = () => {
  return [{ tempId: shortid.generate() }];
};

const getLetterData = async caseId => {
  return await models.referral_letter.findOne({
    where: { caseId: caseId },
    attributes: ["id", "caseId"],
    include: [
      {
        model: models.case_officer,
        as: "caseOfficers",
        attributes: ["id", "officerId", "firstName", "middleName", "lastName"], //must include officerId or will be named unknown officer
        include: [
          {
            model: models.referral_letter_officer,
            as: "referralLetterOfficer",
            attributes: [
              "id",
              "caseOfficerId",
              "historicalBehaviorNotes",
              "numHistoricalHighAllegations",
              "numHistoricalMedAllegations",
              "numHistoricalLowAllegations"
            ],
            include: [
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
      }
    ]
  });
};

module.exports = getReferralLetter;
