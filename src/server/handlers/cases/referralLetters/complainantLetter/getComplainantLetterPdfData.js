import { OFFICER_COMPLAINANT_TITLE } from "../../../../../sharedUtilities/constants";
import { getPersonType } from "../../../../policeDataManager/models/modelUtilities/getPersonType";
import models from "../../../../policeDataManager/models";
import { retrieveSignatureImage } from "../retrieveSignatureImage";

const getComplainantLetterPdfData = async ({ caseId, complainant }) => {
  const c4se = await models.cases.findByPk(caseId, {
    attributes: ["caseReference", "firstContactDate"]
  });

  let revisedTitle;
  if (complainant.civilianTitle && complainant.civilianTitle.name !== "N/A") {
    revisedTitle = complainant.civilianTitle.name;
  } else if (
    !complainant.civilianTitle ||
    (complainant.civilianTitle.name && complainant.civilianTitle.name === "N/A")
  ) {
    revisedTitle = "";
  } else {
    revisedTitle = OFFICER_COMPLAINANT_TITLE;
  }

  const complainantLetterType = await models.letter_types.findOne({
    where: { type: "COMPLAINANT" },
    include: [
      {
        model: models.signers,
        as: "defaultSender",
        attributes: ["signatureFile", "name", "title"]
      }
    ]
  });

  return {
    caseReference: c4se.caseReference,
    recipientFirstName: complainant.firstName,
    recipientLastName: complainant.lastName,
    complainantAddress: complainant.address ? complainant.address : null,
    complainantEmail: complainant.email ? complainant.email : null,
    firstContactDate: c4se.firstContactDate,
    title: revisedTitle,
    complainantPersonType: getPersonType(complainant),
    signature: await retrieveSignatureImage(
      complainantLetterType
        ? complainantLetterType.defaultSender.signatureFile
        : undefined
    ),
    sender: complainantLetterType
      ? complainantLetterType.defaultSender
      : undefined,
    senderName: complainantLetterType
      ? complainantLetterType.defaultSender.name +
        "\n" +
        complainantLetterType.defaultSender.title
      : ""
  };
};

export default getComplainantLetterPdfData;
