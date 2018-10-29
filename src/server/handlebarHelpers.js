import Handlebars from "handlebars";
import moment from "moment";
import {
  computeTimeZone,
  format12HourTime
} from "../client/utilities/formatDate";
import formatPhoneNumber from "../client/utilities/formatPhoneNumber";

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

export const sumAllegations = referralLetterOfficer => {
  let total = 0;
  if (referralLetterOfficer.numHistoricalHighAllegations) {
    total += referralLetterOfficer.numHistoricalHighAllegations;
  }
  if (referralLetterOfficer.numHistoricalMedAllegations) {
    total += referralLetterOfficer.numHistoricalMedAllegations;
  }
  if (referralLetterOfficer.numHistoricalLowAllegations) {
    total += referralLetterOfficer.numHistoricalLowAllegations;
  }
  return total;
};
Handlebars.registerHelper("sumAllegations", sumAllegations);

export const showOfficerHistory = referralLetterOfficer => {
  return (
    sumAllegations(referralLetterOfficer) ||
    isPresent(referralLetterOfficer.historicalBehaviorNotes) ||
    referralLetterOfficer.referralLetterOfficerHistoryNotes.length > 0
  );
};
Handlebars.registerHelper("showOfficerHistory", showOfficerHistory);

export const showOfficerHistoryHeader = accusedOfficers => {
  const referralLetterOfficers = accusedOfficers.map(
    officer => officer.referralLetterOfficer
  );
  return referralLetterOfficers.some(showOfficerHistory);
};
Handlebars.registerHelper("showOfficerHistoryHeader", showOfficerHistoryHeader);

const formatTime = (date, time) => {
  if (!time) return time;
  return format12HourTime(time) + " " + computeTimeZone(date, time);
};
Handlebars.registerHelper("formatTime", formatTime);

const formatDate = date => {
  if (!date) return date;
  return moment(date, "YYYY/MM/DD").format("MM/DD/YYYY");
};
Handlebars.registerHelper("formatDate", formatDate);

const formatPhone = phoneNumber => {
  if (!phoneNumber) return phoneNumber;
  return formatPhoneNumber(phoneNumber);
};
Handlebars.registerHelper("formatPhoneNumber", formatPhone);
