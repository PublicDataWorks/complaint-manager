import formatDate from "../../utilities/formatDate";
import CaseDetailCard from "./CaseDetailCard";
import React from "react";

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
  let complainantCivilianData = [];

  complainantCivilianData = caseDetail.complainantCivilians.map(complainant => {
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

    complainantCivilianData.push({
      "Civilian Name": complainant.fullName,
      Race: complainant.raceEthnicity,
      "Gender Identity": complainant.genderIdentity,
      DOB: complainantBirthDate,
      Address: complainantAddress,
      "Cell Phone": complainant.phoneNumber,
      Email: complainant.email
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
        ID: `#${complainant.windowsUsername}`,
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
        ID: `#${witness.windowsUsername}`,
        District: witness.district
      });
    }
    return witnessOfficerData;
  })[0];

  if (witnessCivilianData) {
    return witnessCivilianData.concat(witnessOfficerData);
  } else {
    return witnessOfficerData || ["No witnesses have been added"];
  }
};

export const getAccusedOfficerData = caseDetail => {
  return caseDetail.accusedOfficers.map(officer => {
    let officerData = officer.isUnknownOfficer
      ? [{ Name: "Unknown" }]
      : [
          {
            "Officer Name": officer.fullName,
            ID: `#${officer.windowsUsername}`,
            District: officer.district
          }
        ];

    let allegationData = [];
    allegationData = officer.allegations.map(allegation => {
      const rule = allegation.allegation ? allegation.allegation.rule : null;
      const paragraph = allegation.allegation
        ? allegation.allegation.paragraph
        : null;
      const directive = allegation.allegation
        ? allegation.allegation.directive
        : null;

      allegationData.push({
        Rule: rule,
        Paragraph: paragraph,
        Directive: directive,
        Severity: allegation.severity,
        "Allegation Details": allegation.details
      });
      return allegationData;
    })[0];

    return (
      <CaseDetailCard
        cardTitle={"Accused Officer"}
        cardData={officerData}
        cardSecondTitle={"Allegations"}
        allegations={allegationData ? allegationData : []}
      />
    );
  });
};
