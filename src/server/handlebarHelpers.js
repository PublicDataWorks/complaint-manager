import Handlebars from "handlebars";
import moment from "moment";
import {
  computeTimeZone,
  format12HourTime
} from "../client/utilities/formatDate";
import formatDate from "../client/utilities/formatDate";
import formatPhoneNumber from "../client/utilities/formatPhoneNumber";

Handlebars.registerHelper("formatAddress", address => {
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
});

const isPresent = value => value && value !== "" && value !== "<p><br></p>";
Handlebars.registerHelper("isPresent", isPresent);

Handlebars.registerHelper("renderHtml", html => {
  if (html) return new Handlebars.SafeString(html);
  return "";
});

const sumAllegations = referralLetterOfficer => {
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

const showOfficerHistory = referralLetterOfficer => {
  return (
    sumAllegations(referralLetterOfficer) ||
    isPresent(referralLetterOfficer.historicalBehaviorNotes) ||
    referralLetterOfficer.referralLetterOfficerHistoryNotes.length > 0
  );
};
Handlebars.registerHelper("showOfficerHistory", showOfficerHistory);

Handlebars.registerHelper("showOfficerHistoryHeader", accusedOfficers => {
  const referralLetterOfficers = accusedOfficers.map(
    officer => officer.referralLetterOfficer
  );
  return referralLetterOfficers.some(showOfficerHistory);
});

Handlebars.registerHelper("formatTime", (date, time) => {
  if (!time) return time;
  return format12HourTime(time) + " " + computeTimeZone(date, time);
});

Handlebars.registerHelper("formatDate", date => {
  if (!date) return date;
  return moment(date, "YYYY/MM/DD").format("MM/DD/YYYY");
});

Handlebars.registerHelper("formatPhoneNumber", phoneNumber => {
  if (!phoneNumber) return phoneNumber;
  return formatPhoneNumber(phoneNumber);
});
