import Handlebars from "handlebars";
import {
  computeTimeZone,
  format12HourTime,
  formatShortDate
} from "../client/utilities/formatDate";
import formatPhoneNumber from "../client/utilities/formatPhoneNumber";
import {
  CIVILIAN_INITIATED,
  RANK_INITIATED
} from "../sharedUtilities/constants";
import formatDate from "../client/utilities/formatDate";

export const formatAddress = address => {
  if (!address) return "";
  const addressArray = [
    address.streetAddress,
    address.intersection,
    address.city,
    address.state
  ];

  const addressString = addressArray
    .filter(addressPart => {
      return addressPart && addressPart !== "";
    })
    .join(", ");

  return addressString !== ""
    ? addressString + ` ${address.zipCode}`
    : addressString;
};
Handlebars.registerHelper("formatAddress", formatAddress);

export const isPresent = value =>
  value && value !== "" && value !== "<p><br></p>";
Handlebars.registerHelper("isPresent", isPresent);

export const renderHtml = html => {
  if (html) return new Handlebars.SafeString(html);
  return "";
};
Handlebars.registerHelper("renderHtml", renderHtml);

export const sumAllegations = letterOfficer => {
  let total = 0;
  if (letterOfficer.numHistoricalHighAllegations) {
    total += letterOfficer.numHistoricalHighAllegations;
  }
  if (letterOfficer.numHistoricalMedAllegations) {
    total += letterOfficer.numHistoricalMedAllegations;
  }
  if (letterOfficer.numHistoricalLowAllegations) {
    total += letterOfficer.numHistoricalLowAllegations;
  }
  return total;
};
Handlebars.registerHelper("sumAllegations", sumAllegations);

export const showOfficerHistory = letterOfficer => {
  return (
    sumAllegations(letterOfficer) ||
    isPresent(letterOfficer.historicalBehaviorNotes) ||
    letterOfficer.referralLetterOfficerHistoryNotes.length > 0
  );
};
Handlebars.registerHelper("showOfficerHistory", showOfficerHistory);

export const showOfficerHistoryHeader = accusedOfficers => {
  const letterOfficers = accusedOfficers.map(officer => officer.letterOfficer);
  return letterOfficers.some(showOfficerHistory);
};
Handlebars.registerHelper("showOfficerHistoryHeader", showOfficerHistoryHeader);

Handlebars.registerHelper("formatTime", (date, time) => {
  if (!time) return time;
  return format12HourTime(time) + " " + computeTimeZone(date, time);
});

Handlebars.registerHelper("formatDate", date => {
  return formatShortDate(date);
});

Handlebars.registerHelper("formatPhoneNumber", phoneNumber => {
  if (!phoneNumber) return phoneNumber;
  return formatPhoneNumber(phoneNumber);
});

export const officerHasRecommendedActionsOrNotes = letterOfficer => {
  return (
    letterOfficer.recommendedActionNotes ||
    letterOfficer.referralLetterOfficerRecommendedActions.length > 0
  );
};

export const showRecommendedActions = accusedOfficers => {
  return accusedOfficers
    .map(officer => {
      return officer.letterOfficer;
    })
    .some(officerHasRecommendedActionsOrNotes);
};
Handlebars.registerHelper("showRecommendedActions", showRecommendedActions);

export const determineComplaintTypeCode = complaintType => {
  if (complaintType === CIVILIAN_INITIATED) {
    return "CC";
  }
  if (complaintType === RANK_INITIATED) {
    return "PO";
  }
};
Handlebars.registerHelper(
  "determineComplaintTypeCode",
  determineComplaintTypeCode
);

export const parseIncidentYear = date => {
  if (date) {
    return date.substring(0, 4);
  }
  return "";
};
Handlebars.registerHelper("parseIncidentYear", parseIncidentYear);
