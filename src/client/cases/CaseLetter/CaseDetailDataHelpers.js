import formatDate, {
  computeTimeZone,
  format12HourTime
} from "../../utilities/formatDate";
import formatPhoneNumber from "../../utilities/formatPhoneNumber";

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
    ? caseDetail.incidentLocation.streetAddress +
      " " +
      caseDetail.incidentLocation.city +
      " " +
      caseDetail.incidentLocation.state +
      " " +
      caseDetail.incidentLocation.zipCode
    : "";
  const incidentTime = formatTimeForDisplay(
    caseDetail.incidentDate,
    caseDetail.incidentTime
  );

  return [
    {
      "First Contacted IPM": formatDate(caseDetail.firstContactDate),
      "Incident Date": incidentDate,
      "Incident Time": incidentTime,
      "Incident Location": incidentLocation.trim() ? incidentLocation : null,
      "Additional Location Information": caseDetail.incidentLocation
        ? caseDetail.incidentLocation.streetAddress2
        : null,
      District: caseDetail.district,
      Classification: caseDetail.classification.initialism
    }
  ];
};

export const getComplainantData = caseDetail => {
  let complainantCivilianData = caseDetail.complainantCivilians.map(
    complainant => {
      const complainantBirthDate = getFormattedDate(complainant.birthDate);
      const complainantAddress = complainant.address
        ? complainant.address.streetAddress +
          " " +
          complainant.address.city +
          " " +
          complainant.address.state +
          " " +
          complainant.address.zipCode
        : "";
      const complainantPhoneNumber = formatPhoneNumber(complainant.phoneNumber);

      return {
        "Civilian Name": complainant.fullName,
        Race: complainant.raceEthnicity,
        "Gender Identity": complainant.genderIdentity,
        DOB: complainantBirthDate,
        Address: complainantAddress.trim() ? complainantAddress : null,
        "Additional Address Information": complainant.address
          ? complainant.address.streetAddress2
          : null,
        "Cell Phone": complainantPhoneNumber,
        Email: complainant.email
      };
    }
  );

  let complainantOfficerData = caseDetail.complainantOfficers.map(
    complainant => {
      if (complainant.isUnknownOfficer) {
        return { Name: "Unknown" };
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
      return { Name: "Unknown" };
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
    ? [{ Name: "Unknown" }]
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
