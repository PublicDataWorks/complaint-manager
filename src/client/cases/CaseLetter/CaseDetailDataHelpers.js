import formatDate from "../../utilities/formatDate";

export const getFormattedDate = date => {
  return date ? formatDate(date) : null;
};

export const getIncidentInfoData = caseDetail => {
  const incidentDate = getFormattedDate(caseDetail.incidentDate);
  return [
    {
      "First Contacted IPM": formatDate(caseDetail.firstContactDate),
      "Incident Date": incidentDate,
      "Incident Time": caseDetail.incidentTime,
      "Incident Location":
        caseDetail.incidentLocation.streetAddress +
        " " +
        caseDetail.incidentLocation.city +
        " " +
        caseDetail.incidentLocation.state +
        " " +
        caseDetail.incidentLocation.zipCode,
      District: caseDetail.district
    }
  ];
};

export const getComplainantData = caseDetail => {
  let complainantCivilianData = [];
  complainantCivilianData = caseDetail.complainantCivilians.map(complainant => {
    const complainantBirthDate = getFormattedDate(complainant.birthDate);
    complainantCivilianData.push({
      "Civilian Name": complainant.fullName,
      Race: complainant.raceEthnicity,
      "Gender Identity": complainant.genderIdentity,
      DOB: complainantBirthDate,
      Address:
        complainant.address.streetAddress +
        " " +
        complainant.address.city +
        " " +
        complainant.address.state +
        " " +
        complainant.address.zipCode,
      "Cell Phone": complainant.phoneNumber
    });
    return complainantCivilianData;
  })[0];

  let complainantOfficerData = [];
  complainantOfficerData = caseDetail.complainantOfficers.map(complainant => {
    if (complainant.isUnknownOfficer) {
      complainantOfficerData.push({ Name: "Unknown" });
    } else
      complainantOfficerData.push({
        "Officer Name": complainant.fullName,
        ID: complainant.windowsUsername,
        District: complainant.district
      });
    return complainantOfficerData;
  })[0];

  if (complainantCivilianData) {
    return complainantCivilianData.concat(complainantOfficerData);
  } else {
    return complainantOfficerData || [];
  }
};

export const getWitnessData = caseDetail => {
  let witnessCivilianData = [];
  witnessCivilianData = caseDetail.witnessCivilians.map(witness => {
    witnessCivilianData.push({
      "Civilian Name": witness.fullName,
      "Email Address": witness.email
    });
    return witnessCivilianData;
  })[0];

  let witnessOfficerData = [];
  witnessOfficerData = caseDetail.witnessOfficers.map(witness => {
    if (witness.isUnknownOfficer) {
      witnessOfficerData.push({ Name: "Unknown" });
    } else {
      witnessOfficerData.push({
        "Officer Name": witness.fullName,
        ID: witness.windowsUsername,
        District: witness.district
      });
    }
    return witnessOfficerData;
  })[0];

  if (witnessCivilianData) {
    return witnessCivilianData.concat(witnessOfficerData);
  } else {
    return witnessOfficerData || [];
  }
};
