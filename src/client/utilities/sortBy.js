import _ from "lodash";
import getFirstComplainant from "./getFirstComplainant";

const STATUS = Object.freeze({
  Initial: 1,
  Active: 2,
  Forwarded: 3,
  Suspended: 4,
  Complete: 5
});

const complainantExists = ({ complainantCivilians }) => {
  const complainant = getFirstComplainant(complainantCivilians);

  return Boolean(complainant);
};

const existingComplainantLastName = ({ complainantCivilians }) => {
  const complainant = getFirstComplainant(complainantCivilians);

  if (complainant) {
    return complainant.lastName.toUpperCase();
  } else {
    return null;
  }
};

const hasAccusedOfficers = ({ accusedOfficers }) => {
  return accusedOfficers.length > 0;
};

const isUnknownOfficer = ({ accusedOfficers }) => {
  if (accusedOfficers.length > 0) {
    const name = accusedOfficers[0].officer.fullName;
    if (name === "Unknown Officer") {
      return name;
    }
  }
  return null;
};

const accusedOfficerLastName = ({ accusedOfficers }) => {
  if (accusedOfficers.length > 0 && accusedOfficers[0].officer.lastName) {
    return accusedOfficers[0].officer.lastName.toUpperCase();
  } else {
    return null;
  }
};

const sortBy = (collection, sortBy, sortDirection) => {
  if (sortBy === "status") {
    if (sortDirection === "asc") {
      return _.sortBy(collection, [
        o => {
          return STATUS[o.status];
        }
      ]);
    }
    if (sortDirection === "desc") {
      return _.sortBy(collection, [
        o => {
          return STATUS[o.status];
        }
      ]).reverse();
    }
  }

  if (sortBy === "lastName") {
    const sortedCases = _.sortBy(collection, [
      complainantExists,
      existingComplainantLastName
    ]);

    if (sortDirection === "desc") {
      return sortedCases.reverse();
    } else return sortedCases;
  }

  if (sortBy === "accusedOfficer") {
    const sortedCases = _.sortBy(collection, [
      hasAccusedOfficers,
      isUnknownOfficer,
      accusedOfficerLastName
    ]);

    if (sortDirection === "desc") {
      return sortedCases.reverse();
    } else return sortedCases;
  }

  if (sortBy === "assignedTo") {
    const sortedCases = _.sortBy(collection, [
      o => {
        return o.assignedTo.toUpperCase();
      }
    ]);

    if (sortDirection === "desc") {
      return sortedCases.reverse();
    } else return sortedCases;
  }

  return _.orderBy(collection, sortBy, sortDirection);
};

export default sortBy;
