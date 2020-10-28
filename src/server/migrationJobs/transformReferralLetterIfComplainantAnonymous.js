const config = require("../config/config");
import models from "../policeDataManager/models";
const createConfiguredS3Instance = require("../createConfiguredS3Instance");

export const transformReferralLetterIfComplainantAnonymous = async (
  referralLetters,
  transaction
) => {
  const s3 = createConfiguredS3Instance();
  for (let i = 0; i < referralLetters.length; i++) {
    const caseId = referralLetters[i].caseId;
    const fileName = referralLetters[i].finalPdfFilename
      ? referralLetters[i].finalPdfFilename
      : "_____";
    const fileParts = fileName.split("_");
    const firstContactDate = fileParts[0];
    const caseReference = fileParts[1];

    if (caseReference.startsWith("AC")) {
      const newFilename = `${firstContactDate}_${caseReference}_PIB_Referral_Anonymous.pdf`;
      await copyAndDeleteObjectS3(caseId, fileName, newFilename, s3);
      await updateFilenameDB(referralLetters[i], newFilename);
    }
  }
};

export const reverseTransformReferralLetterIfComplainantAnonymous = async (
  referralLetters,
  transaction
) => {
  const s3 = createConfiguredS3Instance();
  for (let i = 0; i < referralLetters.length; i++) {
    const caseId = referralLetters[i].caseId;

    const letterCase = await models.cases.findByPk(caseId, {
      attributes: ["caseReference", "year", "caseNumber", "primaryComplainant"],
      include: [
        {
          model: models.civilian,
          as: "complainantCivilians",
          attributes: ["isAnonymous", "lastName", "createdAt"]
        },
        {
          model: models.case_officer,
          as: "complainantOfficers",
          attributes: [
            "isAnonymous",
            "lastName",
            "caseEmployeeType",
            "createdAt",
            "officerId"
          ]
        }
      ],
      paranoid: false
    });

    const fileName = referralLetters[i].finalPdfFilename
      ? referralLetters[i].finalPdfFilename
      : "_____";
    const fileParts = fileName.split("_");
    const firstContactDate = fileParts[0];
    const caseReference = fileParts[1];
    const anonymousPortion = fileParts[4];
    const lastname = letterCase.primaryComplainant.lastName;

    if (
      caseReference.startsWith("AC") &&
      anonymousPortion === "Anonymous.pdf"
    ) {
      const newFilename = `${firstContactDate}_${caseReference}_PIB_Referral_${lastname}.pdf`;
      await copyAndDeleteObjectS3(caseId, fileName, newFilename, s3);
      await updateFilenameDB(referralLetters[i], newFilename);
    }
  }
};

const copyAndDeleteObjectS3 = async (caseId, oldFilename, newFilename, s3) => {
  // copy object in same bucket with the new filename
  const copiedObj = s3.copyObject({
    Bucket: config[process.env.NODE_ENV].referralLettersBucket,
    CopySource: `${
      config[process.env.NODE_ENV].referralLettersBucket
    }/${caseId}/${oldFilename}`,
    Key: `${caseId}/${newFilename}`,
    ServerSideEncryption: "AES256"
  });

  await copiedObj.promise();

  // delete the original object with the oldname
  const deletedObj = s3.deleteObject({
    Bucket: config[process.env.NODE_ENV].referralLettersBucket,
    Key: `${caseId}/${oldFilename}`
  });

  await deletedObj.promise();
};

const updateFilenameDB = async (referralLetter, newFilename) => {
  await referralLetter.update(
    { finalPdfFilename: newFilename },
    { auditUser: "migration to update anonymous complainant filenames" }
  );
};
