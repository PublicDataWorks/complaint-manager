import formatDate, {
  computeTimeZone,
  format12HourTime
} from "../../../utilities/formatDate";
import formatPhoneNumber from "../../../utilities/formatPhoneNumber";
import { formatAddressAsString } from "../../../utilities/formatAddress";

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
      "First Contacted IPM": formatDate(caseDetail.firstContactDate),
      "Incident Date": incidentDate,
      "Incident Time": incidentTime,
      "Incident Location": incidentLocation ? incidentLocation : null,
      District: caseDetail.district,
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
        "Gender Identity": complainant.genderIdentity,
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
      } else
        return {
          "Officer Name": complainant.fullName,
          ID: `#${complainant.windowsUsername}`,
          District: complainant.district
        };
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
      return {
        "Officer Name": witness.fullName,
        ID: `#${witness.windowsUsername}`,
        District: witness.district
      };
    }
  });

  return witnessCivilianData.concat(witnessOfficerData).length === 0
    ? ["No witnesses have been added"]
    : witnessCivilianData.concat(witnessOfficerData);
};

export const getAccusedOfficerData = officer => {
  return officer.isUnknownOfficer
    ? [{ "Officer Name": "Unknown" }]
    : [
        {
          "Officer Name": officer.fullName,
          ID: `#${officer.windowsUsername}`,
          District: officer.district
        }
      ];
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
