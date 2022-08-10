"use strict";

const INSERT_LETTER_FIELDS = `INSERT INTO letter_fields (field, relation, is_required, letter_type, is_for_body, sort_by, sort_direction) 
  VALUES 
    ('caseReference', 'cases', false, &&complainant&&, false, NULL, NULL), 
    ('firstContactDate', 'cases', false, &&complainant&&, false, NULL, NULL), 
    ('primaryComplainant', 'cases', false, &&referral&&, false, NULL, NULL),
    ('firstContactDate', 'cases', false, &&referral&&, false, NULL, NULL),
    ('complaintType', 'cases', false, &&referral&&, false, NULL, NULL),
    ('id', 'cases', false, &&referral&&, false, NULL, NULL),
    ('year', 'cases', false, &&referral&&, false, NULL, NULL),
    ('caseNumber', 'cases', false, &&referral&&, false, NULL, NULL),
    ('caseReference', 'cases', false, &&referral&&, false, NULL, NULL),
    ('pibCaseNumber', 'cases', false, &&referral&&, false, NULL, NULL),
    ('*', 'complainantCivilians', false, &&referral&&, false, NULL, NULL),
    ('*', 'complainantOfficers', false, &&referral&&, false, NULL, NULL),
    ('recipient', 'referralLetter', false, &&referral&&, false, NULL, NULL),
    ('recipientAddress', 'referralLetter', false, &&referral&&, false, NULL, NULL),
    ('sender', 'referralLetter', false, &&referral&&, false, NULL, NULL),
    ('transcribedBy', 'referralLetter', false, &&referral&&, false, NULL, NULL),
    ('id', 'cases', false, &&referral&&, true, NULL, NULL),
    ('incidentDate', 'cases', false, &&referral&&, true, NULL, NULL),
    ('incidentTime', 'cases', false, &&referral&&, true, NULL, NULL),
    ('incidentTimezone', 'cases', false, &&referral&&, true, NULL, NULL),
    ('narrativeDetails', 'cases', false, &&referral&&, true, NULL, NULL),
    ('firstContactDate', 'cases', false, &&referral&&, true, NULL, NULL),
    ('complaintType', 'cases', false, &&referral&&, true, NULL, NULL),
    ('year', 'cases', false, &&referral&&, true, NULL, NULL),
    ('caseNumber', 'cases', false, &&referral&&, true, NULL, NULL),
    ('pibCaseNumber', 'cases', false, &&referral&&, true, NULL, NULL),
    ('caseReference', 'cases', false, &&referral&&, true, NULL, NULL),
    ('*', 'referralLetter', false, &&referral&&, true, NULL, NULL),
    ('*', 'caseClassifications', false, &&referral&&, true, NULL, NULL),
    ('*', 'caseClassifications.classification', false, &&referral&&, true, NULL, NULL),
    ('*', 'incidentLocation', false, &&referral&&, true, NULL, NULL),
    ('*', 'complainantCivilians', false, &&referral&&, true, 'createdAt', 'asc'),
    ('*', 'complainantCivilians.raceEthnicity', false, &&referral&&, true, NULL, NULL),
    ('*', 'complainantCivilians.genderIdentity', false, &&referral&&, true, NULL, NULL),
    ('*', 'complainantCivilians.address', false, &&referral&&, true, NULL, NULL),
    ('*', 'witnessCivilians', false, &&referral&&, true, 'createdAt', 'asc'),
    ('*', 'complainantOfficers', false, &&referral&&, true, 'createdAt', 'asc'),
    ('*', 'accusedOfficers', false, &&referral&&, true, NULL, NULL),
    ('*', 'accusedOfficers.allegations', false, &&referral&&, true, NULL, NULL),
    ('*', 'accusedOfficers.allegations.allegation', false, &&referral&&, true, NULL, NULL),
    ('*', 'accusedOfficers.letterOfficer', false, &&referral&&, true, NULL, NULL),
    ('*', 'accusedOfficers.letterOfficer.referralLetterOfficerHistoryNotes', false, &&referral&&, true, NULL, NULL),
    ('*', 'accusedOfficers.letterOfficer.referralLetterOfficerRecommendedActions', false, &&referral&&, true, NULL, NULL),
    ('*', 'accusedOfficers.letterOfficer.referralLetterOfficerRecommendedActions.recommendedAction', false, &&referral&&, true, NULL, NULL),
    ('*', 'witnessOfficers', false, &&referral&&, true, 'createdAt', 'asc')
  `;

const LETTER_TYPE_QUERY = `SELECT id, type FROM letter_types`;

module.exports = {
  up: async queryInterface => {
    try {
      await queryInterface.sequelize.transaction(async transaction => {
        await queryInterface.sequelize
          .query(LETTER_TYPE_QUERY, { transaction })
          .then(async types => {
            let query = types[0].reduce((q, letterType) => {
              if (letterType.type === "REFERRAL") {
                return q.replace(/&&referral&&/gi, letterType.id);
              } else if (letterType.type === "COMPLAINANT") {
                return q.replace(/&&complainant&&/gi, letterType.id);
              } else {
                return q;
              }
            }, INSERT_LETTER_FIELDS);
            await queryInterface.sequelize.query(query, { transaction });
          });
      });
    } catch (error) {
      throw new Error(
        `Error while seeding letter type data. Internal Error: ${error}`
      );
    }
  },

  down: async queryInterface => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.sequelize.query("TRUNCATE letter_fields CASCADE", {
        transaction
      });
    });
  }
};
