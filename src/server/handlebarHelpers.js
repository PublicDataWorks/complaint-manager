import Handlebars from "handlebars";

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

const isPresent = value => value && value !== "";
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

Handlebars.registerHelper("showOfficerHistory", referralLetterOfficer => {
  return (
    sumAllegations(referralLetterOfficer) ||
    isPresent(referralLetterOfficer.historicalBehaviorNotes) ||
    referralLetterOfficer.referralLetterOfficerHistoryNotes.length > 0
  );
});
