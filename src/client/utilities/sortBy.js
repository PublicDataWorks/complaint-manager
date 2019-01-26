import _ from "lodash";
import getFirstComplainant from "./getFirstComplainant";
import { CASE_STATUS_MAP } from "../../sharedUtilities/constants";

const STATUS = Object.freeze(CASE_STATUS_MAP);

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

  if (sortBy === "primaryComplainant") {
    const sortedCases = _.sortBy(collection, [
      "primaryComplainant",
      ({ primaryComplainant: c }) => c && c.lastName.toUpperCase()
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

  if (sortBy === "caseReference") {
    return _.orderBy(
      collection,
      ["year", "caseNumber"],
      [sortDirection, sortDirection]
    );
  }

  return _.orderBy(collection, sortBy, sortDirection);
};

export default sortBy;
