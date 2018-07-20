import moment from "moment/moment";

const calculateAgeBasedOnIncidentDate = (person, incidentDate) => {
  if (!incidentDate) return "N/A";
  return !person.officerId
    ? !person.birthDate
      ? null
      : moment(incidentDate).diff(person.birthDate, "years", false)
    : !person.dob
      ? null
      : moment(incidentDate).diff(person.dob, "years", false);
};

export default calculateAgeBasedOnIncidentDate;
