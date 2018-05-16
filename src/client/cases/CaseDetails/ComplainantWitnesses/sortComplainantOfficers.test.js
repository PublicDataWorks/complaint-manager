import CaseOfficer from "../../../testUtilities/caseOfficer";
import Civilian from "../../../testUtilities/civilian";
import Officer from "../../../testUtilities/Officer";
import Case from "../../../testUtilities/case";
import sortComplainantOfficers from "./sortComplainantOfficers";

test("it can sort mixed complainant officers", () => {
  const civilianComplainant = new Civilian.Builder()
    .defaultCivilian()
    .withFirstName("Charlie")
    .withLastName("Alpha")
    .build();

  const civilianComplainantThree = new Civilian.Builder()
    .defaultCivilian()
    .withFirstName("Bravo")
    .withLastName("Alpha")
    .build();

  const civilianComplainantTwo = new Civilian.Builder()
    .defaultCivilian()
    .withLastName("Zorph")
    .build();

  const officerComplainant = new Officer.Builder()
    .defaultOfficer()
    .withLastName("Miller")
    .build();

  const caseOfficer = new CaseOfficer.Builder()
    .defaultCaseOfficer()
    .withRoleOnCase("Complainant")
    .withNotes("This is Miller")
    .withOfficer(officerComplainant)
    .build();

  const caseOfficerUnknown = new CaseOfficer.Builder()
    .defaultCaseOfficer()
    .withRoleOnCase("Witness")
    .withOfficer({ fullName: "Unknown Officer" })
    .build();

  const caseWithMixedComplainants = new Case.Builder()
    .defaultCase()
    .withCivilians([
      civilianComplainantTwo,
      civilianComplainant,
      civilianComplainantThree
    ])
    .withComplainantWitnessOfficers([caseOfficerUnknown, caseOfficer])
    .build();

  const expected = [
    caseOfficerUnknown,
    civilianComplainantThree,
    civilianComplainant,
    caseOfficer,
    civilianComplainantTwo
  ];

  const result = sortComplainantOfficers(caseWithMixedComplainants);

  expect(result).toEqual(expected);
});
