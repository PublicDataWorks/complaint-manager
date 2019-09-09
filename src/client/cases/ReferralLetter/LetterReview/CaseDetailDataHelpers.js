import formatDate, {
  computeTimeZone,
  format12HourTime
} from "../../../utilities/formatDate";
import formatPhoneNumber from "../../../utilities/formatPhoneNumber";
import { formatAddressAsString } from "../../../utilities/formatAddress";
import { EMPLOYEE_TYPE } from "../../../../sharedUtilities/constants";

export const getFormattedDate = date => {
  return date ? formatDate(date) : null;
};

const formatTimeForDisplay = (date, time) => {
  if (!time) return time;
  return format12HourTime(time) + " " + computeTimeZone(date, time);
};

export const getIncidentInfoData = caseDetail => {
  const incidentDate = getFormattedDate(caseDetail.incidentDate);
  const incidentLocation = caseDetail.incidentLocation
    ? formatAddressAsString(caseDetail.incidentLocation)
    : null;
  const incidentTime = formatTimeForDisplay(
    caseDetail.incidentDate,
    caseDetail.incidentTime
  );

  return [
    {
      "First Contacted OIPM": formatDate(caseDetail.firstContactDate),
      "Incident Date": incidentDate,
      "Incident Time": incidentTime,
      "Incident Location": incidentLocation ? incidentLocation : null,
      District: caseDetail.caseDistrict ? caseDetail.caseDistrict.name : null,
      Classification: caseDetail.classification
        ? caseDetail.classification.initialism
        : null,
      "PIB Case Number": caseDetail.pibCaseNumber
    }
  ];
};

export const getComplainantData = caseDetail => {
  let complainantCivilianData = caseDetail.complainantCivilians.map(
    complainant => {
      const complainantBirthDate = getFormattedDate(complainant.birthDate);
      const complainantAddress = complainant.address
        ? formatAddressAsString(complainant.address)
        : null;
      const complainantPhoneNumber = formatPhoneNumber(complainant.phoneNumber);

      return {
        "Civilian Name": complainant.fullName,
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
          complainant.caseEmployeeType === EMPLOYEE_TYPE.CIVILIAN_WITHIN_NOPD
            ? "Civilian (NOPD) Name"
            : "Officer Name";
        const complainantData = {
          [nameTitle]: complainant.fullName,
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
      "Civilian Name": witness.fullName,
      "Cell Phone": witnessPhoneNumber,
      "Email Address": witness.email
    };
  });

  let witnessOfficerData = caseDetail.witnessOfficers.map(witness => {
    if (witness.isUnknownOfficer) {
      return { "Officer Name": "Unknown" };
    } else {
      const nameTitle =
        witness.caseEmployeeType === EMPLOYEE_TYPE.CIVILIAN_WITHIN_NOPD
          ? "Civilian (NOPD) Name"
          : "Officer Name";
      const witnessData = {
        [nameTitle]: witness.fullName,
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
      officer.caseEmployeeType === EMPLOYEE_TYPE.CIVILIAN_WITHIN_NOPD
        ? "Civilian (NOPD) Name"
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
