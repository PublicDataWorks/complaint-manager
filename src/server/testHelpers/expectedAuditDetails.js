import models from "../policeDataManager/models";

export const expectedCaseAuditDetails = {
  cases: expect.objectContaining({
    attributes: expect.toIncludeSameMembers([
      "assignedTo",
      "caseNumber",
      "caseReference",
      "caseReferencePrefix",
      "complaintType",
      "createdAt",
      "createdBy",
      "districtId",
      "firstContactDate",
      "howDidYouHearAboutUsSourceId",
      "id",
      "incidentDate",
      "incidentTime",
      "incidentTimezone",
      "intakeSourceId",
      "isArchived",
      "narrativeDetails",
      "narrativeSummary",
      "pdfAvailable",
      "pibCaseNumber",
      "primaryComplainant",
      "statusId",
      "updatedAt",
      "year"
    ]),
    model: models.cases.name
  }),
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
  caseClassifications: {
    attributes: expect.toIncludeSameMembers(
      Object.keys(models.case_classification.rawAttributes)
    ),
    model: models.case_classification.name
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
  },
  caseDistrict: {
    attributes: expect.toIncludeSameMembers(
      Object.keys(models.district.rawAttributes)
    ),
    model: models.district.name
  },
  status: {
    attributes: expect.toIncludeSameMembers(
      Object.keys(models.caseStatus.rawAttributes).filter(
        attribute => attribute !== "createdAt" && attribute !== "updatedAt"
      )
    ),
    model: models.caseStatus.name
  }
};
