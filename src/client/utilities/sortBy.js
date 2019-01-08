import _ from "lodash";
import getFirstComplainant from "./getFirstComplainant";
import {CASE_STATUS_MAP} from "../../sharedUtilities/constants";

const STATUS = Object.freeze(CASE_STATUS_MAP);

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

const isKnownOfficer = ({ accusedOfficers }) => {
  if (accusedOfficers.length > 0) {
    return !accusedOfficers[0].isUnknownOfficer;
  }
  return null;
};

const accusedOfficerLastName = ({ accusedOfficers }) => {
  if (accusedOfficers.length > 0 && accusedOfficers[0].lastName) {
    return accusedOfficers[0].lastName.toUpperCase();
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
      isKnownOfficer,
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
