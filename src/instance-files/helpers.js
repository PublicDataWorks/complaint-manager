export const generateSubjectLine = (caseReference, pibCaseNumber) => {
  if (pibCaseNumber) {
    return `Supplemental Referral; OIPM Complaint ${caseReference}; PIB Case ${pibCaseNumber}`;
  }
  return `Complaint Referral; OIPM Complaint ${caseReference}`;
};
