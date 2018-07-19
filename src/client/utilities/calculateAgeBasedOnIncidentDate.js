import moment from "moment/moment";

const calculateAgeBasedOnIncidentDate = (person, incidentDate) => {
  return incidentDate === null
    ? "N/A"
    : person.dob === undefined
      ? moment(incidentDate).diff(person.birthDate, "years", false)
      : moment(incidentDate).diff(person.dob, "years", false);
};

export default calculateAgeBasedOnIncidentDate;
