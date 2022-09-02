import asyncMiddleware from "../../../asyncMiddleware";
import models from "../../../../policeDataManager/models";
import Boom from "boom";
import throwErrorIfLetterFlowUnavailable from "../throwErrorIfLetterFlowUnavailable";
import { BAD_REQUEST_ERRORS } from "../../../../../sharedUtilities/errorMessageConstants";
import { updateCaseToActiveIfInitial } from "../../helpers/caseStatusHelpers";

const editOfficerHistory = asyncMiddleware(async (request, response, next) => {
  await throwErrorIfLetterFlowUnavailable(request.params.caseId);
  await models.sequelize.transaction(async transaction => {
    if (request.body.letterOfficers) {
      await createOrUpdateLetterOfficers(
        request.body.letterOfficers,
        request.nickname,
        transaction
      );
    }

    await updateCaseToActiveIfInitial(
      request.params.caseId,
      request.nickname,
      transaction
    );
  });

  return response.status(200).send();
});

const createOrUpdateLetterOfficers = async (
  letterOfficers,
  userNickname,
  transaction
) => {
  for (const letterOfficerData of letterOfficers) {
    normalizeNumericValues(letterOfficerData);
    if (letterOfficerData.id) {
      await updateExistingLetterOfficer(
        letterOfficerData,
        userNickname,
        transaction
      );
    } else {
      await createNewLetterOfficer(
        letterOfficerData,
        userNickname,
        transaction
      );
    }
  }
};

const updateExistingLetterOfficer = async (
  letterOfficerData,
  userNickname,
  transaction
) => {
  const letterOfficer = await models.letter_officer.findByPk(
    letterOfficerData.id
  );
  if (!letterOfficer) {
    throw Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_LETTER_OFFICER);
  }
  if (letterOfficer.caseOfficerId !== letterOfficerData.caseOfficerId) {
    throw Boom.badRequest(
      BAD_REQUEST_ERRORS.INVALID_LETTER_OFFICER_CASE_OFFICER_COMBINATION
    );
  }
  await letterOfficer.update(letterOfficerData, {
    auditUser: userNickname,
    transaction
  });
  await createUpdateOrDeleteOfficerHistoryNotes(
    letterOfficerData.referralLetterOfficerHistoryNotes,
    letterOfficer,
    userNickname,
    transaction
  );
};

const createUpdateOrDeleteOfficerHistoryNotes = async (
  notesData,
  letterOfficer,
  userNickname,
  transaction
) => {
  notesData = filterOutBlankNotes(notesData);
  await deleteUnsubmittedExistingOfficerHistoryNotes(
    notesData,
    letterOfficer.id,
    userNickname,
    transaction
  );

  if (notesData.length === 0) {
    return;
  }

  for (const noteData of notesData) {
    if (noteData.id) {
      await updateExistingOfficerHistoryNote(
        noteData,
        userNickname,
        transaction
      );
    } else {
      await createNewOfficerHistoryNote(
        noteData,
        letterOfficer.id,
        userNickname,
        transaction
      );
    }
  }
};

const deleteUnsubmittedExistingOfficerHistoryNotes = async (
  notesData,
  referralLetterOfficerId,
  userNickname,
  transaction
) => {
  const existingNotesIds =
    await getExistingOfficerHistoryNoteIdsForReferralOfficer(
      referralLetterOfficerId
    );
  if (existingNotesIds.length === 0) {
    return;
  }
  const submittedNotesIds = notesData.map(noteData => {
    return noteData.id;
  });
  const noteIdsToBeDeleted = existingNotesIds.filter(
    existingNoteId => !submittedNotesIds.includes(existingNoteId)
  );
  await models.referral_letter_officer_history_note.destroy({
    where: { id: noteIdsToBeDeleted },
    auditUser: userNickname,
    transaction
  });
};

const getExistingOfficerHistoryNoteIdsForReferralOfficer =
  async referralLetterOfficerId => {
    const officerHistoryNotes =
      await models.referral_letter_officer_history_note.findAll({
        where: {
          referralLetterOfficerId: referralLetterOfficerId
        },
        attributes: ["id"],
        raw: true
      });

    return officerHistoryNotes.map(note => note.id);
  };

const updateExistingOfficerHistoryNote = async (
  noteData,
  userNickname,
  transaction
) => {
  const note = await models.referral_letter_officer_history_note.findByPk(
    noteData.id
  );
  if (!note) {
    throw Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_OFFICER_HISTORY_NOTE);
  }
  await note.update(noteData, { auditUser: userNickname, transaction });
};

const createNewOfficerHistoryNote = async (
  noteData,
  referralLetterOfficerId,
  userNickname,
  transaction
) => {
  await models.referral_letter_officer_history_note.create(
    {
      ...noteData,
      referralLetterOfficerId: referralLetterOfficerId
    },
    { auditUser: userNickname, transaction }
  );
};

const createNewLetterOfficer = async (
  letterOfficerData,
  userNickname,
  transaction
) => {
  letterOfficerData = removeEmptyNotesFromOfficerData(letterOfficerData);
  const caseOfficer = await models.case_officer.findByPk(
    letterOfficerData.caseOfficerId
  );
  if (!caseOfficer) {
    throw Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_CASE_OFFICER);
  }
  await models.letter_officer.create(letterOfficerData, {
    include: [
      {
        model: models.referral_letter_officer_history_note,
        as: "referralLetterOfficerHistoryNotes",
        auditUser: userNickname,
        transaction
      }
    ],
    auditUser: userNickname,
    transaction
  });
};

const removeEmptyNotesFromOfficerData = letterOfficerData => {
  letterOfficerData.referralLetterOfficerHistoryNotes = filterOutBlankNotes(
    letterOfficerData.referralLetterOfficerHistoryNotes
  );
  return letterOfficerData;
};

const filterOutBlankNotes = notesData => {
  return notesData.filter(
    noteData =>
      !isValueBlank(noteData.pibCaseNumber) || !isValueBlank(noteData.details)
  );
};

const normalizeNumericValues = letterOfficerData => {
  if (isValueBlank(letterOfficerData.numHistoricalHighAllegations)) {
    letterOfficerData.numHistoricalHighAllegations = null;
  }
  if (isValueBlank(letterOfficerData.numHistoricalMedAllegations)) {
    letterOfficerData.numHistoricalMedAllegations = null;
  }
  if (isValueBlank(letterOfficerData.numHistoricalLowAllegations)) {
    letterOfficerData.numHistoricalLowAllegations = null;
  }
  if (typeof letterOfficerData.officerHistoryOption === "string") {
    letterOfficerData.officerHistoryOptionId = parseInt(
      letterOfficerData.officerHistoryOption
    );
  }
};

const isValueBlank = value => {
  if (typeof value === "string") {
    value = value.trim();
  }
  if (value === 0 || value === "0") {
    return false;
  }
  return !value;
};

export default editOfficerHistory;
