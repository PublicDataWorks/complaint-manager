import Handlebars from "handlebars";
import {
  computeTimeZone,
  format12HourTime,
  formatLongDate,
  formatShortDate
} from "../client/utilities/formatDate";
import formatPhoneNumber from "../client/utilities/formatPhoneNumber";
import { SIGNATURE_URLS } from "../sharedUtilities/constants";

const caseReferenceLength = 4;

export const formatAddress = address => {
  if (!address) return "";
  const addressArray = [
    address.streetAddress,
    address.streetAddress2,
    address.intersection,
    address.city,
    address.state
  ];

  let addressString = addressArray
    .filter(addressPart => {
      return addressPart && addressPart !== "";
    })
    .join(", ");

  if (addressString !== "") {
    addressString += ` ${address.zipCode}`;
  }

  if (address.additionalLocationInfo) {
    addressString += ` (${address.additionalLocationInfo})`;
  }

  return addressString;
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
  const letterOfficers = accusedOfficers
    .map(officer => officer.letterOfficer)
    .filter(letterOfficer => letterOfficer != null);
  return letterOfficers.some(showOfficerHistory);
};
Handlebars.registerHelper("showOfficerHistoryHeader", showOfficerHistoryHeader);

Handlebars.registerHelper("formatTime", (date, time) => {
  if (!time) return time;
  return format12HourTime(time) + " " + computeTimeZone(date, time);
});

Handlebars.registerHelper("formatShortDate", date => {
  return formatShortDate(date);
});

Handlebars.registerHelper("formatLongDate", date => {
  return formatLongDate(date);
});

Handlebars.registerHelper("formatPhoneNumber", phoneNumber => {
  if (!phoneNumber) return phoneNumber;
  return formatPhoneNumber(phoneNumber);
});

export const officerHasRecommendedActionsOrNotes = letterOfficer => {
  return (
    letterOfficer &&
    (letterOfficer.recommendedActionNotes ||
      letterOfficer.referralLetterOfficerRecommendedActions.length > 0)
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

export const newLineToLineBreak = text => {
  text = Handlebars.Utils.escapeExpression(text);
  text = text.replace(/(\r\n|\n|\r)/gm, "<br>");
  return text;
};
Handlebars.registerHelper("newLineToLineBreak", newLineToLineBreak);

export const extractFirstLine = text => {
  if (!text) {
    return "";
  }
  return text.split("\n")[0];
};
Handlebars.registerHelper("extractFirstLine", extractFirstLine);

export const generateSignature = (sender, includeSignature) => {
  if (includeSignature && sender.includes("Stella Cziment")) {
    return `<img style="max-height: 55px" src=${SIGNATURE_URLS.STELLA} />`;
  }
  return "<p><br></p>";
};
Handlebars.registerHelper("generateSignature", generateSignature);

export const generateSubjectLine = (caseReference, pibCaseNumber) => {
  if (pibCaseNumber) {
    return `Supplemental Referral; IPM Complaint ${caseReference}; PIB Case ${pibCaseNumber}`;
  }
  return `Complaint Referral; IPM Complaint ${caseReference}`;
};
Handlebars.registerHelper("generateSubjectLine", generateSubjectLine);
