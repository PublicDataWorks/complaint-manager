import moment from "moment";

const constructFilename = (
  caseId,
  caseNumber,
  firstContactDate,
  complainantLastName
) => {
  const formattedFirstContactDate = moment(firstContactDate).format(
    "MM-DD-YYYY"
  );
  const strippedLastName = complainantLastName
    ? `_${complainantLastName.replace(/[^a-zA-Z]/g, "")}`
    : "";
  return `${caseId}/${formattedFirstContactDate}_${caseNumber}_PIB_Referral${strippedLastName}.pdf`;
};

export default constructFilename;
