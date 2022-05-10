import formatDate, {
  format12HourTime
} from "../../../../../sharedUtilities/formatDate";
import formatPhoneNumber from "../../../../../sharedUtilities/formatPhoneNumber";
import { formatAddressAsString } from "../../../utilities/formatAddress";

const {
  PERSON_TYPE,
  FIRST_CONTACTED_ORGANIZATION,
  CIVILIAN_WITHIN_PD_TITLE,
  BUREAU_ACRONYM
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

export const getFormattedDate = date => {
  return date ? formatDate(date) : null;
};

const formatTimeForDisplay = (date, time, timezone) => {
  if (!time) return time;
  return format12HourTime(time) + " " + timezone;
};

const pbCaseNumberText = `${BUREAU_ACRONYM} Case Number`;

export const getIncidentInfoData = caseDetail => {
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
      [FIRST_CONTACTED_ORGANIZATION]: formatDate(caseDetail.firstContactDate),
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
    ? `(AC) ${complainantOrWitness.fullName}`
    : complainantOrWitness.fullName;

export const getComplainantData = caseDetail => {
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

  let complainantOfficerData = caseDetail.complainantOfficers.map(
    complainant => {
      if (complainant.isUnknownOfficer) {
        return { "Officer Name": "Unknown" };
      } else {
        const nameTitle =
          complainant.caseEmployeeType ===
          PERSON_TYPE.CIVILIAN_WITHIN_PD.employeeDescription
            ? `${CIVILIAN_WITHIN_PD_TITLE} Name`
            : "Officer Name";

        const complainantData = {
          [nameTitle]: fullNameIsAnonymous(complainant),
          ID: `#${complainant.windowsUsername}`,
          District: complainant.district
        };
        return complainantData;
      }
    }
  );

  return complainantCivilianData.concat(complainantOfficerData);
};

export const getWitnessData = caseDetail => {
  let witnessCivilianData = caseDetail.witnessCivilians.map(witness => {
    const witnessPhoneNumber = formatPhoneNumber(witness.phoneNumber);
    return {
      "Civilian Name": fullNameIsAnonymous(witness),
      "Cell Phone": witnessPhoneNumber,
      "Email Address": witness.email
    };
  });

  let witnessOfficerData = caseDetail.witnessOfficers.map(witness => {
    if (witness.isUnknownOfficer) {
      return { "Officer Name": "Unknown" };
    } else {
      const nameTitle =
        witness.caseEmployeeType ===
        PERSON_TYPE.CIVILIAN_WITHIN_PD.employeeDescription
          ? `${CIVILIAN_WITHIN_PD_TITLE} Name`
          : "Officer Name";
      const witnessData = {
        [nameTitle]: fullNameIsAnonymous(witness),
        ID: `#${witness.windowsUsername}`,
        District: witness.district
      };
      return witnessData;
    }
  });

  return witnessCivilianData.concat(witnessOfficerData).length === 0
    ? ["No witnesses have been added"]
    : witnessCivilianData.concat(witnessOfficerData);
};

export const getAccusedOfficerData = officer => {
  let officerData;

  if (officer.isUnknownOfficer) {
    officerData = [{ "Officer Name": "Unknown" }];
  } else {
    const nameTitle =
      officer.caseEmployeeType ===
      PERSON_TYPE.CIVILIAN_WITHIN_PD.employeeDescription
        ? `${CIVILIAN_WITHIN_PD_TITLE} Name`
        : "Officer Name";
    officerData = [
      {
        [nameTitle]: officer.fullName,
        ID: `#${officer.windowsUsername}`,
        District: officer.district
      }
    ];
  }
  return officerData;
};

export const getAllegationData = officer => {
  return officer.allegations.map(allegation => {
    const rule = allegation.allegation ? allegation.allegation.rule : null;
    const paragraph = allegation.allegation
      ? allegation.allegation.paragraph
      : null;
    const directive = allegation.allegation
      ? allegation.allegation.directive
      : null;

    return {
      Rule: rule,
      Paragraph: paragraph,
      Directive: directive,
      Severity: allegation.severity,
      "Allegation Details": allegation.details
    };
  });
};
