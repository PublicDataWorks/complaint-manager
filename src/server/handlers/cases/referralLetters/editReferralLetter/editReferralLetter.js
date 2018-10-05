import asyncMiddleware from "../../../asyncMiddleware";
import models from "../../../../models";
import Boom from "boom";
import getLetterDataForResponse from "../getLetterDataForResponse";

const editReferralLetter = asyncMiddleware(async (request, response, next) => {
  if (request.body.referralLetterOfficers) {
    await models.sequelize.transaction(async transaction => {
      await createOrUpdateReferralLetterOfficers(
        request.body.referralLetterOfficers,
        request.nickname,
        transaction
      );
    });
  }
  const letterDataForResponse = await getLetterDataForResponse(
    request.params.caseId
  );
  return response.status(201).send(letterDataForResponse);
});

const createOrUpdateReferralLetterOfficers = async (
  referralLetterOfficers,
  userNickname,
  transaction
) => {
  for (const referralLetterOfficerData of referralLetterOfficers) {
    if (referralLetterOfficerData.id) {
      await updateExistingReferralLetterOfficer(
        referralLetterOfficerData,
        userNickname,
        transaction
      );
    } else {
      await createNewReferralLetterOfficer(
        referralLetterOfficerData,
        userNickname,
        transaction
      );
    }
  }
};

const updateExistingReferralLetterOfficer = async (
  referralLetterOfficerData,
  userNickname,
  transaction
) => {
  const referralLetterOfficer = await models.referral_letter_officer.findById(
    referralLetterOfficerData.id
  );
  if (!referralLetterOfficer) {
    throw Boom.badRequest("Invalid letter officer");
  }
  if (
    referralLetterOfficer.caseOfficerId !==
    referralLetterOfficerData.caseOfficerId
  ) {
    throw Boom.badRequest("Invalid letter officer case officer combination");
  }
  await referralLetterOfficer.update(referralLetterOfficerData, {
    auditUser: userNickname,
    transaction
  });
  await createUpdateOrDeleteOfficerHistoryNotes(
    referralLetterOfficerData.referralLetterOfficerHistoryNotes,
    referralLetterOfficer,
    userNickname,
    transaction
  );
};

const createUpdateOrDeleteOfficerHistoryNotes = async (
  notesData,
  referralLetterOfficer,
  userNickname,
  transaction
) => {
  notesData = filterOutBlankNotes(notesData);
  await deleteUnsubmittedExistingOfficerHistoryNotes(
    notesData,
    referralLetterOfficer.id,
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
        referralLetterOfficer.id,
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
  const existingNotesIds = await getExistingOfficerHistoryNoteIdsForReferralOfficer(
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
  await models.referral_letter_officer_history_note.destroy(
    {
      where: { id: noteIdsToBeDeleted }
    },
    { auditUser: userNickname, transaction }
  );
};

const getExistingOfficerHistoryNoteIdsForReferralOfficer = async referralLetterOfficerId => {
  return await models.referral_letter_officer_history_note
    .findAll({
      where: {
        referralLetterOfficerId: referralLetterOfficerId
      },
      attributes: ["id"],
      raw: true
    })
    .map(note => {
      return note.id;
    });
};

const updateExistingOfficerHistoryNote = async (
  noteData,
  userNickname,
  transaction
) => {
  const note = await models.referral_letter_officer_history_note.findById(
    noteData.id
  );
  if (!note) {
    throw Boom.badRequest("Invalid officer history note");
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

const createNewReferralLetterOfficer = async (
  referralLetterOfficerData,
  userNickname,
  transaction
) => {
  referralLetterOfficerData = removeEmptyNotesFromOfficerData(
    referralLetterOfficerData
  );
  const caseOfficer = await models.case_officer.findById(
    referralLetterOfficerData.caseOfficerId
  );
  if (!caseOfficer) {
    throw Boom.badRequest("Invalid case officer");
  }
  const a = await models.referral_letter_officer.create(
    referralLetterOfficerData,
    {
      include: [
        {
          model: models.referral_letter_officer_history_note,
          as: "referralLetterOfficerHistoryNotes"
        }
      ],
      auditUser: userNickname,
      transaction
    }
  );
};

const removeEmptyNotesFromOfficerData = referralLetterOfficerData => {
  referralLetterOfficerData.referralLetterOfficerHistoryNotes = filterOutBlankNotes(
    referralLetterOfficerData.referralLetterOfficerHistoryNotes
  );
  return referralLetterOfficerData;
};

const filterOutBlankNotes = notesData => {
  return notesData.filter(
    noteData =>
      !isValueBlank(noteData.pibCaseNumber) && !isValueBlank(noteData.details)
  );
};

const isValueBlank = value => {
  if (typeof value === "string") {
    value = value.trim();
  }
  return !value;
};

export default editReferralLetter;
