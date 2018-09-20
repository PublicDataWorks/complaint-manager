import formatDate from "../../utilities/formatDate";

export const getFormattedDate = date => {
  return date ? formatDate(date) : null;
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
    : null;

  return [
    {
      "First Contacted IPM": formatDate(caseDetail.firstContactDate),
      "Incident Date": incidentDate,
      "Incident Time": caseDetail.incidentTime,
      "Incident Location": incidentLocation,
      District: caseDetail.district
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
        : null;

      return {
        "Civilian Name": complainant.fullName,
        Race: complainant.raceEthnicity,
        "Gender Identity": complainant.genderIdentity,
        DOB: complainantBirthDate,
        Address: complainantAddress,
        "Cell Phone": complainant.phoneNumber,
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
    return {
      "Civilian Name": witness.fullName,
      "Email Address": witness.email
    };
  });

  if (witnessCivilianData.length === 0) {
    witnessCivilianData = ["No witnesses have been added"];
  }

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

  return witnessCivilianData.concat(witnessOfficerData);
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
