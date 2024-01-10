import models from "../policeDataManager/models";

export const expectedCaseAuditDetails = {
  cases: expect.objectContaining({
    attributes: expect.arrayContaining([
      "assignedTo",
      "caseNumber",
      "caseReference",
      "caseReferencePrefix",
      "complaintTypeId",
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
      "isCase",
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
    attributes: expect.arrayContaining(
      Object.keys(models.intake_source.rawAttributes)
    ),
    model: models.intake_source.name
  },
  howDidYouHearAboutUsSource: {
    attributes: expect.arrayContaining(
      Object.keys(models.how_did_you_hear_about_us_source.rawAttributes)
    ),
    model: models.how_did_you_hear_about_us_source.name
  },
  complainantCivilians: {
    attributes: expect.arrayContaining(
      Object.keys(models.civilian.rawAttributes)
    ),
    model: models.civilian.name
  },
  complainantInmates: {
    attributes: expect.arrayContaining(
      Object.keys(models.caseInmate.rawAttributes)
    ),
    model: models.caseInmate.name
  },
  witnessInmates: {
    attributes: expect.arrayContaining(
      Object.keys(models.caseInmate.rawAttributes)
    ),
    model: models.caseInmate.name
  },
  accusedInmates: {
    attributes: expect.arrayContaining(
      Object.keys(models.caseInmate.rawAttributes)
    ),
    model: models.caseInmate.name
  },
  inmate: {
    attributes: expect.arrayContaining(
      Object.keys(models.inmate.rawAttributes)
    ),
    model: models.inmate.name
  },
  address: {
    attributes: expect.arrayContaining(
      Object.keys(models.address.rawAttributes)
    ),
    model: models.address.name
  },
  raceEthnicity: {
    attributes: expect.arrayContaining(
      Object.keys(models.race_ethnicity.rawAttributes)
    ),
    model: models.race_ethnicity.name
  },
  genderIdentity: {
    attributes: expect.arrayContaining(
      Object.keys(models.gender_identity.rawAttributes)
    ),
    model: models.gender_identity.name
  },
  witnessCivilians: {
    attributes: expect.arrayContaining(
      Object.keys(models.civilian.rawAttributes)
    ),
    model: models.civilian.name
  },
  attachment: {
    attributes: expect.arrayContaining(
      Object.keys(models.attachment.rawAttributes)
    ),
    model: models.attachment.name
  },
  incidentLocation: {
    attributes: expect.arrayContaining(
      Object.keys(models.address.rawAttributes)
    ),
    model: models.address.name
  },
  accusedOfficers: {
    attributes: expect.arrayContaining(
      Object.keys(models.case_officer.rawAttributes)
    ),
    model: models.case_officer.name
  },
  accusedCivilians: {
    attributes: expect.arrayContaining(
      Object.keys(models.civilian.rawAttributes)
    ),
    model: models.civilian.name
  },
  allegations: {
    attributes: expect.arrayContaining(
      Object.keys(models.officer_allegation.rawAttributes)
    ),
    model: models.officer_allegation.name
  },
  allegation: {
    attributes: expect.arrayContaining(
      Object.keys(models.allegation.rawAttributes)
    ),
    model: models.allegation.name
  },
  caseClassifications: {
    attributes: expect.arrayContaining(
      Object.keys(models.case_classification.rawAttributes)
    ),
    model: models.case_classification.name
  },
  complainantOfficers: {
    attributes: expect.arrayContaining(
      Object.keys(models.case_officer.rawAttributes)
    ),
    model: models.case_officer.name
  },
  witnessOfficers: {
    attributes: expect.arrayContaining(
      Object.keys(models.case_officer.rawAttributes)
    ),
    model: models.case_officer.name
  },
  caseDistrict: {
    attributes: expect.arrayContaining(
      Object.keys(models.district.rawAttributes)
    ),
    model: models.district.name
  },
  status: {
    attributes: expect.arrayContaining(
      Object.keys(models.caseStatus.rawAttributes).filter(
        attribute => attribute !== "createdAt" && attribute !== "updatedAt"
      )
    ),
    model: models.caseStatus.name
  },
  personTypeDetails: {
    attributes: expect.arrayContaining(
      Object.keys(models.personType.rawAttributes)
    ),
    model: models.personType.name
  },
  defaultPersonType: {
    attributes: expect.arrayContaining(
      Object.keys(models.personType.rawAttributes)
    ),
    model: models.personType.name
  },
  ruleChapter: {
    attributes: expect.arrayContaining(
      Object.keys(models.ruleChapter.rawAttributes)
    ),
    model: models.ruleChapter.name
  },
  directive: {
    attributes: expect.arrayContaining(
      Object.keys(models.directive.rawAttributes)
    ),
    model: models.directive.name
  }
};
