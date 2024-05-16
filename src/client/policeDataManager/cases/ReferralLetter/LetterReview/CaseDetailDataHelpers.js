import formatDate, {
  format12HourTime
} from "../../../../../sharedUtilities/formatDate";
import formatPhoneNumber from "../../../../../sharedUtilities/formatPhoneNumber";
import { formatAddressAsString } from "../../../utilities/formatAddress";

export const getFormattedDate = date => {
  return date ? formatDate(date) : null;
};

const formatTimeForDisplay = (date, time, timezone) => {
  if (!time) return time;
  return format12HourTime(time) + " " + timezone;
};

export const getIncidentInfoData = (caseDetail, organization) => {
  const incidentDate = getFormattedDate(caseDetail.incidentDate);
  const incidentLocation = caseDetail.incidentLocation
    ? formatAddressAsString(caseDetail.incidentLocation)
    : null;
  const incidentTime = formatTimeForDisplay(
    caseDetail.incidentDate,
    caseDetail.incidentTime,
    caseDetail.incidentTimezone
  );

  return [
    {
      [`First Contacted ${organization}`]: formatDate(
        caseDetail.firstContactDate
      ),
      "Incident Date": incidentDate,
      "Incident Time": incidentTime,
      "Incident Location": incidentLocation ? incidentLocation : null,
      District: caseDetail.caseDistrict ? caseDetail.caseDistrict.name : null,
      pbCaseNumberText: caseDetail.pibCaseNumber
    }
  ];
};

const fullNameIsAnonymous = complainantOrWitness =>
  complainantOrWitness.isAnonymous
    ? `(ANON) ${complainantOrWitness.fullName}`
    : complainantOrWitness.fullName;

export const mapOfficer = (officer, pd) => {
  if (officer.isUnknownOfficer) {
    return { "Officer Name": "Unknown" };
  } else {
    const nameTitle = officer.caseEmployeeType?.includes("Civilian")
      ? `Civilian (${pd}) Name`
      : "Officer Name";

    const officerData = {
      [nameTitle]: fullNameIsAnonymous(officer),
      ID: `#${officer.employeeId}`,
      District: officer.district
    };
    return officerData;
  }
};

export const getComplainantData = (caseDetail, pd) => {
  let complainantCivilianData = caseDetail.complainantCivilians.map(
    complainant => {
      const complainantBirthDate = getFormattedDate(complainant.birthDate);
      const complainantAddress = complainant.address
        ? formatAddressAsString(complainant.address)
        : null;
      const complainantPhoneNumber = formatPhoneNumber(complainant.phoneNumber);

      return {
        "Civilian Name": fullNameIsAnonymous(complainant),
        Race: complainant.raceEthnicity && complainant.raceEthnicity.name,
        "Gender Identity":
          complainant.genderIdentity && complainant.genderIdentity.name,
        DOB: complainantBirthDate,
        Address: complainantAddress ? complainantAddress : null,
        "Cell Phone": complainantPhoneNumber,
        Email: complainant.email
      };
    }
  );

  let complainantOfficerData = caseDetail.complainantOfficers.map(officer =>
    mapOfficer(officer, pd)
  );

  return complainantCivilianData.concat(complainantOfficerData);
};

export const getWitnessData = (caseDetail, pd) => {
  let witnessCivilianData = caseDetail.witnessCivilians.map(witness => {
    const witnessPhoneNumber = formatPhoneNumber(witness.phoneNumber);
    return {
      "Civilian Name": fullNameIsAnonymous(witness),
      "Cell Phone": witnessPhoneNumber,
      "Email Address": witness.email
    };
  });

  let witnessOfficerData = caseDetail.witnessOfficers.map(officer =>
    mapOfficer(officer, pd)
  );

  return witnessCivilianData.concat(witnessOfficerData).length === 0
    ? ["No witnesses have been added"]
    : witnessCivilianData.concat(witnessOfficerData);
};

export const getAllegationData = officer => {
  return officer.allegations.map(allegation => {
    const rule = allegation.allegation ? allegation.allegation.rule : null;
    const paragraph = allegation.allegation
      ? allegation.allegation.paragraph
      : null;
    const directive = allegation.directive
      ? allegation.directive.name
      : allegation.customDirective;
    const chapter = allegation.ruleChapter?.name;

    return {
      Rule: rule,
      Paragraph: paragraph,
      Directive: directive,
      Severity: allegation.severity,
      "To Wit Chapter": chapter,
      "Allegation Details": allegation.details
    };
  });
};
