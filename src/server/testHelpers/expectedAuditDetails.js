import models from "../models";

export const expectedCaseAuditDetails = {
  cases: expect.objectContaining({
    attributes: expect.toIncludeSameMembers([
      "assignedTo",
      "caseNumber",
      "caseReference",
      "classificationId",
      "complaintType",
      "createdAt",
      "createdBy",
      "district",
      "firstContactDate",
      "howDidYouHearAboutUsSourceId",
      "id",
      "incidentDate",
      "incidentTime",
      "intakeSourceId",
      "isArchived",
      "narrativeDetails",
      "narrativeSummary",
      "nextStatus",
      "pdfAvailable",
      "pibCaseNumber",
      "primaryComplainant",
      "status",
      "updatedAt",
      "year"
    ]),
    model: models.cases.name
  }),
  classification: {
    attributes: expect.toIncludeSameMembers(
      Object.keys(models.classification.rawAttributes)
    ),
    model: models.classification.name
  },
  intakeSource: {
    attributes: expect.toIncludeSameMembers(
      Object.keys(models.intake_source.rawAttributes)
    ),
    model: models.intake_source.name
  },
  howDidYouHearAboutUsSource: {
    attributes: expect.toIncludeSameMembers(
      Object.keys(models.how_did_you_hear_about_us_source.rawAttributes)
    ),
    model: models.how_did_you_hear_about_us_source.name
  },
  complainantCivilians: {
    attributes: expect.toIncludeSameMembers(
      Object.keys(models.civilian.rawAttributes)
    ),
    model: models.civilian.name
  },
  address: {
    attributes: expect.toIncludeSameMembers(
      Object.keys(models.address.rawAttributes)
    ),
    model: models.address.name
  },
  raceEthnicity: {
    attributes: expect.toIncludeSameMembers(
      Object.keys(models.race_ethnicity.rawAttributes)
    ),
    model: models.race_ethnicity.name
  },
  genderIdentity: {
    attributes: expect.toIncludeSameMembers(
      Object.keys(models.gender_identity.rawAttributes)
    ),
    model: models.gender_identity.name
  },
  witnessCivilians: {
    attributes: expect.toIncludeSameMembers(
      Object.keys(models.civilian.rawAttributes)
    ),
    model: models.civilian.name
  },
  attachment: {
    attributes: expect.toIncludeSameMembers(
      Object.keys(models.attachment.rawAttributes)
    ),
    model: models.attachment.name
  },
  incidentLocation: {
    attributes: expect.toIncludeSameMembers(
      Object.keys(models.address.rawAttributes)
    ),
    model: models.address.name
  },
  accusedOfficers: {
    attributes: expect.toIncludeSameMembers(
      Object.keys(models.case_officer.rawAttributes)
    ),
    model: models.case_officer.name
  },
  allegations: {
    attributes: expect.toIncludeSameMembers(
      Object.keys(models.officer_allegation.rawAttributes)
    ),
    model: models.officer_allegation.name
  },
  allegation: {
    attributes: expect.toIncludeSameMembers(
      Object.keys(models.allegation.rawAttributes)
    ),
    model: models.allegation.name
  },
  complainantOfficers: {
    attributes: expect.toIncludeSameMembers(
      Object.keys(models.case_officer.rawAttributes)
    ),
    model: models.case_officer.name
  },
  witnessOfficers: {
    attributes: expect.toIncludeSameMembers(
      Object.keys(models.case_officer.rawAttributes)
    ),
    model: models.case_officer.name
  }
};

//TODO: delete when remove newAuditFeature toggle
export const expectedFormattedCaseAuditDetails = {
  Case: expect.toIncludeSameMembers([
    "Assigned To",
    "Case Number",
    "Case Reference",
    "Classification Id",
    "Complaint Type",
    "Created At",
    "Created By",
    "District",
    "First Contact Date",
    "How Did You Hear About Us Source Id",
    "Id",
    "Incident Date",
    "Incident Time",
    "Intake Source Id",
    "Is Archived",
    "Narrative Details",
    "Narrative Summary",
    "Next Status",
    "Pdf Available",
    "Pib Case Number",
    "Primary Complainant",
    "Status",
    "Updated At",
    "Year"
  ]),
  Classification: expect.toIncludeSameMembers(["All Classification Data"]),
  "Intake Source": expect.toIncludeSameMembers(["All Intake Source Data"]),
  "How Did You Hear About Us Source": expect.toIncludeSameMembers([
    "All How Did You Hear About Us Source Data"
  ]),
  "Complainant Civilians": expect.toIncludeSameMembers([
    "All Complainant Civilians Data"
  ]),
  Address: expect.toIncludeSameMembers(["All Address Data"]),
  "Race Ethnicity": expect.toIncludeSameMembers(["All Race Ethnicity Data"]),
  "Gender Identity": expect.toIncludeSameMembers(["All Gender Identity Data"]),
  "Witness Civilians": expect.toIncludeSameMembers([
    "All Witness Civilians Data"
  ]),
  Attachment: expect.toIncludeSameMembers(["All Attachment Data"]),
  "Incident Location": expect.toIncludeSameMembers([
    "All Incident Location Data"
  ]),
  "Accused Officers": expect.toIncludeSameMembers([
    "All Accused Officers Data"
  ]),
  Allegations: expect.toIncludeSameMembers(["All Allegations Data"]),
  Allegation: expect.toIncludeSameMembers(["All Allegation Data"]),
  "Complainant Officers": expect.toIncludeSameMembers([
    "All Complainant Officers Data"
  ]),
  "Witness Officers": expect.toIncludeSameMembers(["All Witness Officers Data"])
};
