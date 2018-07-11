import {
  buildTokenWithPermissions,
  cleanupDatabase
} from "../../../testHelpers/requestTestHelpers";
import Officer from "../../../../client/testUtilities/Officer";
import models from "../../../models";
import CaseOfficer from "../../../../client/testUtilities/caseOfficer";
import Allegation from "../../../../client/testUtilities/Allegation";
import OfficerAllegation from "../../../../client/testUtilities/OfficerAllegation";
import app from "../../../server";
import request from "supertest";
import Civilian from "../../../../client/testUtilities/civilian";
import Case from "../../../../client/testUtilities/case";
import moment from "moment";
import {
  COMPLAINANT,
  TIMEZONE,
  WITNESS
} from "../../../../sharedUtilities/constants";
import parse from "csv-parse/lib/sync";
import Address from "../../../../client/testUtilities/Address";

describe("exportCases request", function() {
  let token, caseToExport, civilian, caseOfficer, allegation, officerAllegation;
  beforeEach(async () => {
    token = buildTokenWithPermissions("", "tuser");

    const officerAttributes = new Officer.Builder()
      .defaultOfficer()
      .withId(undefined);
    const officer = await models.officer.create(officerAttributes, {
      auditUser: "tuser"
    });

    const caseAttributes = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withNarrativeSummary("A summary of the narrative.")
      .withNarrativeDetails("Some details about the narrative.");

    caseToExport = await models.cases.create(caseAttributes, {
      auditUser: "tuser",
      include: [
        { model: models.address, as: "incidentLocation", auditUser: "tuser" }
      ]
    });

    const addressAttributes = new Address.Builder()
      .defaultAddress()
      .withAddressableType("civilian")
      .withId(undefined);
    const civilianAttributes = new Civilian.Builder()
      .defaultCivilian()
      .withId(undefined)
      .withRoleOnCase(COMPLAINANT)
      .withCaseId(caseToExport.id)
      .withAddress(addressAttributes);
    civilian = await models.civilian.create(civilianAttributes, {
      auditUser: "tuser",
      include: [{ model: models.address, auditUser: "tuser" }]
    });

    const caseOfficerAttributes = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withId(undefined)
      .withOfficerAttributes(officerAttributes)
      .withCaseId(caseToExport.id)
      .withOfficerId(officer.id);
    caseOfficer = await models.case_officer.create(caseOfficerAttributes, {
      auditUser: "tuser"
    });

    const allegationAttributes = new Allegation.Builder()
      .defaultAllegation()
      .withId(undefined);
    allegation = await models.allegation.create(allegationAttributes, {
      auditUser: "tuser"
    });

    const officerAllegationAttributes = new OfficerAllegation.Builder()
      .defaultOfficerAllegation()
      .withId(undefined)
      .withAllegationId(allegation.id)
      .withCaseOfficerId(caseOfficer.id);
    officerAllegation = await models.officer_allegation.create(
      officerAllegationAttributes,
      { auditUser: "tuser" }
    );
  });
  afterEach(async () => {
    await cleanupDatabase();
  });
  test("should retrieve correct headers", async () => {
    await caseToExport.reload({
      include: [
        {
          model: models.civilian,
          as: "complainantCivilians",
          include: [models.address]
        },
        { model: models.address, as: "incidentLocation" }
      ]
    });

    await request(app)
      .get("/api/cases/export")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then(response => {
        expect(response.text).toEqual(
          expect.stringContaining(
            "Case #," +
              "Case Status," +
              "Created by," +
              "Created on," +
              "First Contact Date," +
              "Incident Date," +
              "Incident Time," +
              "Incident Address," +
              "Incident City," +
              "Incident State," +
              "Incident Zip Code," +
              "Incident District," +
              "Additional Incident Location Info,Complainant Type," +
              "Complainant Name," +
              "Gender Identity (complainant)," +
              "Race/Ethnicity (complainant)," +
              "Birthday (complainant)," +
              "Phone Number (complainant)," +
              "Email (complainant)," +
              "Complainant Address," +
              "Complainant City," +
              "Complainant State," +
              "Complainant Zip Code," +
              "Additional Address Information (complainant)," +
              "Notes (complainant)," +
              "Number of Witnesses," +
              "Witnesses," +
              "Narrative Summary," +
              "Narrative Details," +
              "Accused Officer (Name)," +
              "Officer Windows Username," +
              "Rank/Title," +
              "Supervisor Name," +
              "Supervisor Windows Username," +
              "Employee Type," +
              "District," +
              "Bureau," +
              "Status," +
              "Hire Date," +
              "End of Employment," +
              "Race," +
              "Sex," +
              "Age," +
              "Notes," +
              "Allegation Rule," +
              "Allegation Paragraph," +
              "Allegation Directive," +
              "Allegation Details\n"
          )
        );
      });
  });

  test("should retrieve case data", async () => {
    await caseToExport.reload({
      include: [
        {
          model: models.civilian,
          as: "complainantCivilians",
          include: [models.address]
        },
        { model: models.address, as: "incidentLocation" }
      ]
    });

    await request(app)
      .get("/api/cases/export")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then(response => {
        const resultingCsv = response.text;
        const records = parse(resultingCsv, { columns: true });
        expect(records.length).toEqual(1);
        expect(records[0]["Case #"]).toEqual(caseToExport.id.toString());
        expect(records[0]["Case Status"]).toEqual(caseToExport.status);
        expect(records[0]["Created by"]).toEqual(caseToExport.createdBy);
        expect(records[0]["Created on"]).toEqual(
          moment(caseToExport.createdAt)
            .tz(TIMEZONE)
            .format("MM/DD/YYYY HH:mm:ss ")
        );
        expect(records[0]["First Contact Date"]).toEqual(
          moment(caseToExport.firstContactDate).format("MM/DD/YYYY")
        );
        expect(records[0]["Incident Date"]).toEqual(
          moment(caseToExport.incidentDate).format("MM/DD/YYYY")
        );
        expect(records[0]["Incident Time"]).toEqual(
          moment(caseToExport.incidentTime, "HH:mm:ss").format("HH:mm:ss")
        );
        expect(records[0]["Incident Address"]).toEqual(
          caseToExport.incidentLocation.streetAddress
        );
        expect(records[0]["Incident City"]).toEqual(
          caseToExport.incidentLocation.city
        );
        expect(records[0]["Incident State"]).toEqual(
          caseToExport.incidentLocation.state
        );
        expect(records[0]["Incident Zip Code"]).toEqual(
          caseToExport.incidentLocation.zipCode
        );
        expect(records[0]["Incident District"]).toEqual(caseToExport.district);
        expect(records[0]["Additional Incident Location Info"]).toEqual(
          caseToExport.incidentLocation.streetAddress2
        );
        expect(records[0]["Narrative Summary"]).toEqual(
          caseToExport.narrativeSummary
        );
        expect(records[0]["Narrative Details"]).toEqual(
          caseToExport.narrativeDetails
        );
      });
  });

  test("should retrieve civilian data", async () => {
    await request(app)
      .get("/api/cases/export")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then(response => {
        const resultingCsv = response.text;
        const records = parse(resultingCsv, { columns: true });
        expect(records[0]["Complainant Type"]).toEqual(
          caseToExport.complainantType
        );
        expect(records[0]["Complainant Name"]).toEqual(
          `${civilian.firstName} ${civilian.middleInitial} ${
            civilian.lastName
          } ${civilian.suffix}`
        );
        expect(records[0]["Gender Identity (complainant)"]).toEqual(
          civilian.genderIdentity
        );
        expect(records[0]["Race/Ethnicity (complainant)"]).toEqual(
          civilian.raceEthnicity
        );
        expect(records[0]["Birthday (complainant)"]).toEqual(
          moment(civilian.birthDate).format("MM/DD/YYYY")
        );
        expect(records[0]["Phone Number (complainant)"]).toEqual(
          civilian.phoneNumber
        );
        expect(records[0]["Email (complainant)"]).toEqual(civilian.email);
        expect(records[0]["Complainant Address"]).toEqual(
          civilian.address.streetAddress
        );
        expect(records[0]["Complainant City"]).toEqual(civilian.address.city);
        expect(records[0]["Complainant State"]).toEqual(civilian.address.state);
        expect(records[0]["Complainant Zip Code"]).toEqual(
          civilian.address.zipCode
        );
        expect(
          records[0]["Additional Address Information (complainant)"]
        ).toEqual(civilian.address.streetAddress2);
        expect(records[0]["Notes (complainant)"]).toEqual(
          civilian.additionalInfo
        );
      });
  });

  test("should retrieve civilian data with two civilian complainants", async () => {
    const civilianAttributes2 = new Civilian.Builder()
      .defaultCivilian()
      .withId(undefined)
      .withRoleOnCase(COMPLAINANT)
      .withFirstName("La")
      .withLastName("Croix")
      .withCaseId(caseToExport.id);
    const civilian2 = await models.civilian.create(civilianAttributes2, {
      auditUser: "tuser"
    });

    await request(app)
      .get("/api/cases/export")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then(response => {
        const resultingCsv = response.text;
        const records = parse(resultingCsv, { columns: true });

        expect(records.length).toEqual(2);

        const firstRecord = records[0];
        const secondRecord = records[1];

        expect(firstRecord["Complainant Name"]).toEqual(
          `${civilian.firstName} ${civilian.middleInitial} ${
            civilian.lastName
          } ${civilian.suffix}`
        );
        expect(firstRecord["Case #"]).toEqual(caseToExport.id.toString());

        expect(secondRecord["Complainant Name"]).toEqual(
          `${civilian2.firstName} ${civilian2.middleInitial} ${
            civilian2.lastName
          } ${civilian2.suffix}`
        );
        expect(secondRecord["Case #"]).toEqual(caseToExport.id.toString());
      });
  });

  test.skip("should include witness count when two civilian witnesses", async () => {
    const otherCaseAttributes = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withIncidentLocation(undefined);
    const otherCase = await models.cases.create(otherCaseAttributes, {
      auditUser: "tuser"
    });
    const witness1Attributes = new Civilian.Builder()
      .defaultCivilian()
      .withRoleOnCase(WITNESS)
      .withCaseId(caseToExport.id)
      .withId(undefined);
    const witness2Attributes = new Civilian.Builder()
      .defaultCivilian()
      .withRoleOnCase(WITNESS)
      .withCaseId(caseToExport.id)
      .withId(undefined);
    const witnessOtherCaseAttributes = new Civilian.Builder()
      .defaultCivilian()
      .withRoleOnCase(WITNESS)
      .withCaseId(otherCase.id)
      .withId(undefined);

    await models.civilian.bulkCreate(
      [witness1Attributes, witness2Attributes, witnessOtherCaseAttributes],
      {
        auditUser: "tuser"
      }
    );

    await request(app)
      .get("/api/cases/export")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then(response => {
        const resultingCsv = response.text;
        const records = parse(resultingCsv, { columns: true });
        expect(records.length).toEqual(1);
        expect(records[0]["Number of Witnesses"]).toEqual("2");
        expect(records[2]["Number of Witnesses"]).toEqual("1");
      });
  });

  test.skip("should include witness count when 1 officer witness and 1 civilian witness", async () => {});

  test.skip("should include witness count when no witnesses", async () => {
    await request(app)
      .get("/api/cases/export")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then(response => {
        const resultingCsv = response.text;
        const records = parse(resultingCsv, { columns: true });
        expect(records[0]["Number of Witnesses"]).toEqual("0");
      });
  });

  test("should include data about officer", async () => {
    await request(app)
      .get("/api/cases/export")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then(response => {
        const resultingCsv = response.text;
        const records = parse(resultingCsv, { columns: true });
        const firstRecord = records[0];
        expect(firstRecord["Accused Officer (Name)"]).toEqual(
          `${caseOfficer.firstName} ${caseOfficer.middleName} ${
            caseOfficer.lastName
          }`
        );
        expect(firstRecord["Officer Windows Username"]).toEqual(
          caseOfficer.windowsUsername.toString()
        );
        expect(firstRecord["Rank/Title"]).toEqual(caseOfficer.rank);
        expect(firstRecord["Supervisor Name"]).toEqual(
          `${caseOfficer.supervisorFirstName} ${
            caseOfficer.supervisorMiddleName
          } ${caseOfficer.supervisorLastName}`
        );
        expect(firstRecord["Supervisor Windows Username"]).toEqual(
          caseOfficer.supervisorWindowsUsername.toString()
        );
        expect(firstRecord["Employee Type"]).toEqual(caseOfficer.employeeType);
        expect(firstRecord["District"]).toEqual(caseOfficer.district);
        expect(firstRecord["Bureau"]).toEqual(caseOfficer.bureau);
        expect(firstRecord["Status"]).toEqual(caseOfficer.workStatus);
        expect(firstRecord["Hire Date"]).toEqual(
          moment(caseOfficer.hireDate).format("MM/DD/YYYY")
        );
        expect(firstRecord["End of Employment"]).toEqual(
          moment(caseOfficer.endDate).format("MM/DD/YYYY")
        );
        expect(firstRecord["Race"]).toEqual(caseOfficer.race);
        expect(firstRecord["Sex"]).toEqual(caseOfficer.sex);
        const expectedAge = moment().diff(caseOfficer.dob, "years", false);
        expect(firstRecord["Age"]).toEqual(expectedAge.toString());
        expect(firstRecord["Notes"]).toEqual(caseOfficer.notes);
      });
  });

  test("should include data about two officers", async () => {
    const officerAttributes2 = new Officer.Builder()
      .defaultOfficer()
      .withFirstName("Sally")
      .withLastName("Sanderson")
      .withWindowsUsername(947)
      .withOfficerNumber(11)
      .withId(undefined);
    const officer2 = await models.officer.create(officerAttributes2, {
      auditUser: "tuser"
    });

    const caseOfficerAttributes2 = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withOfficerAttributes(officerAttributes2)
      .withId(undefined)
      .withCaseId(caseToExport.id)
      .withOfficerId(officer2.id);
    const caseOfficer2 = await models.case_officer.create(
      caseOfficerAttributes2,
      {
        auditUser: "tuser"
      }
    );

    await request(app)
      .get("/api/cases/export")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then(response => {
        const resultingCsv = response.text;
        const records = parse(resultingCsv, { columns: true });

        expect(records.length).toEqual(2);

        const firstRecord = records[0];
        const secondRecord = records[1];

        expect(firstRecord["Accused Officer (Name)"]).toEqual(
          caseOfficer.fullName
        );
        expect(firstRecord["Officer Windows Username"]).toEqual(
          caseOfficer.windowsUsername.toString()
        );
        expect(firstRecord["Case #"]).toEqual(caseOfficer.caseId.toString());
        expect(secondRecord["Accused Officer (Name)"]).toEqual(
          caseOfficer2.fullName
        );
        expect(secondRecord["Officer Windows Username"]).toEqual(
          caseOfficer2.windowsUsername.toString()
        );
        expect(secondRecord["Case #"]).toEqual(caseOfficer2.caseId.toString());
      });
  });

  test("exports officers from a different case that case", async () => {
    const otherCaseAttributes = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withIncidentLocation(undefined);
    const otherCase = await models.cases.create(otherCaseAttributes, {
      auditUser: "tuser"
    });

    const officerAttributes2 = new Officer.Builder()
      .defaultOfficer()
      .withFirstName("Sally")
      .withLastName("Sanderson")
      .withWindowsUsername(947)
      .withOfficerNumber(11)
      .withId(undefined);
    const officer2 = await models.officer.create(officerAttributes2, {
      auditUser: "tuser"
    });

    const caseOfficerAttributes2 = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withOfficerAttributes(officerAttributes2)
      .withId(undefined)
      .withCaseId(otherCase.id)
      .withOfficerId(officer2.id);
    const caseOfficer2 = await models.case_officer.create(
      caseOfficerAttributes2,
      {
        auditUser: "tuser"
      }
    );

    await request(app)
      .get("/api/cases/export")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then(response => {
        const resultingCsv = response.text;
        const records = parse(resultingCsv, { columns: true });

        expect(records.length).toEqual(2);

        const firstRecord = records[0];
        const secondRecord = records[1];

        expect(firstRecord["Case #"]).toEqual(caseToExport.id.toString());
        expect(firstRecord["Accused Officer (Name)"]).toEqual(
          caseOfficer.fullName
        );
        expect(firstRecord["Officer Windows Username"]).toEqual(
          caseOfficer.windowsUsername.toString()
        );

        expect(secondRecord["Case #"]).toEqual(otherCase.id.toString());
        expect(secondRecord["Accused Officer (Name)"]).toEqual(
          caseOfficer2.fullName
        );
        expect(secondRecord["Officer Windows Username"]).toEqual(
          caseOfficer2.windowsUsername.toString()
        );
      });
  });

  test("creates 4 rows for 2 civilian complainants and 2 officers", async () => {
    const civilianAttributes2 = new Civilian.Builder()
      .defaultCivilian()
      .withId(undefined)
      .withRoleOnCase(COMPLAINANT)
      .withFirstName("La")
      .withLastName("Croix")
      .withCaseId(caseToExport.id);
    const civilian2 = await models.civilian.create(civilianAttributes2, {
      auditUser: "tuser"
    });

    const officerAttributes2 = new Officer.Builder()
      .defaultOfficer()
      .withFirstName("Sally")
      .withLastName("Sanderson")
      .withWindowsUsername(947)
      .withOfficerNumber(11)
      .withId(undefined);
    const officer2 = await models.officer.create(officerAttributes2, {
      auditUser: "tuser"
    });

    const caseOfficerAttributes2 = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withOfficerAttributes(officerAttributes2)
      .withId(undefined)
      .withCaseId(caseToExport.id)
      .withOfficerId(officer2.id);
    const caseOfficer2 = await models.case_officer.create(
      caseOfficerAttributes2,
      {
        auditUser: "tuser"
      }
    );

    await request(app)
      .get("/api/cases/export")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then(response => {
        const resultingCsv = response.text;
        const records = parse(resultingCsv, { columns: true });

        expect(records.length).toEqual(4);

        const firstRecord = records[0];
        const secondRecord = records[1];
        const thirdRecord = records[2];
        const fourthRecord = records[3];

        expect(firstRecord["Case #"]).toEqual(caseToExport.id.toString());
        expect(firstRecord["Complainant Name"]).toEqual(
          `${civilian.firstName} ${civilian.middleInitial} ${
            civilian.lastName
          } ${civilian.suffix}`
        );
        expect(firstRecord["Accused Officer (Name)"]).toEqual(
          caseOfficer.fullName
        );
        expect(firstRecord["Officer Windows Username"]).toEqual(
          caseOfficer.windowsUsername.toString()
        );

        expect(secondRecord["Case #"]).toEqual(caseToExport.id.toString());
        expect(secondRecord["Complainant Name"]).toEqual(
          `${civilian.firstName} ${civilian.middleInitial} ${
            civilian.lastName
          } ${civilian.suffix}`
        );
        expect(secondRecord["Accused Officer (Name)"]).toEqual(
          caseOfficer2.fullName
        );
        expect(secondRecord["Officer Windows Username"]).toEqual(
          caseOfficer2.windowsUsername.toString()
        );

        expect(thirdRecord["Case #"]).toEqual(caseToExport.id.toString());
        expect(thirdRecord["Complainant Name"]).toEqual(
          `${civilian2.firstName} ${civilian2.middleInitial} ${
            civilian2.lastName
          } ${civilian2.suffix}`
        );
        expect(thirdRecord["Accused Officer (Name)"]).toEqual(
          caseOfficer.fullName
        );
        expect(thirdRecord["Officer Windows Username"]).toEqual(
          caseOfficer.windowsUsername.toString()
        );

        expect(fourthRecord["Case #"]).toEqual(caseToExport.id.toString());
        expect(fourthRecord["Complainant Name"]).toEqual(
          `${civilian2.firstName} ${civilian2.middleInitial} ${
            civilian2.lastName
          } ${civilian2.suffix}`
        );
        expect(fourthRecord["Accused Officer (Name)"]).toEqual(
          caseOfficer2.fullName
        );
        expect(fourthRecord["Officer Windows Username"]).toEqual(
          caseOfficer2.windowsUsername.toString()
        );
      });
  });

  test("exports allegation information for single allegation", async () => {
    await request(app)
      .get("/api/cases/export")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then(response => {
        const resultingCsv = response.text;
        const records = parse(resultingCsv, { columns: true });

        expect(records.length).toEqual(1);
        const record = records[0];
        expect(record["Allegation Rule"]).toEqual(allegation.rule);
        expect(record["Allegation Paragraph"]).toEqual(allegation.paragraph);
        expect(record["Allegation Directive"]).toEqual(allegation.directive);
        expect(record["Allegation Details"]).toEqual(officerAllegation.details);
      });
  });

  test("exports allegation information for two allegations on same officer", async () => {
    const allegation2Attributes = new Allegation.Builder()
      .defaultAllegation()
      .withRule("new rule")
      .withParagraph("new paragraph")
      .withDirective("new directive")
      .withId(undefined);
    const allegation2 = await models.allegation.create(allegation2Attributes, {
      auditUser: "test"
    });
    const officerAllegation2Attributes = new OfficerAllegation.Builder()
      .defaultOfficerAllegation()
      .withId(undefined)
      .withDetails("new details")
      .withAllegationId(allegation2.id)
      .withCaseOfficerId(caseOfficer.id);
    const officerAllegation2 = await models.officer_allegation.create(
      officerAllegation2Attributes,
      { auditUser: "test" }
    );

    await request(app)
      .get("/api/cases/export")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then(response => {
        const resultingCsv = response.text;
        const records = parse(resultingCsv, { columns: true });

        expect(records.length).toEqual(2);
        const record1 = records[0];
        expect(record1["Allegation Rule"]).toEqual(allegation.rule);
        expect(record1["Allegation Paragraph"]).toEqual(allegation.paragraph);
        expect(record1["Allegation Directive"]).toEqual(allegation.directive);
        expect(record1["Allegation Details"]).toEqual(
          officerAllegation.details
        );

        const record2 = records[1];
        expect(record2["Allegation Rule"]).toEqual(allegation2.rule);
        expect(record2["Allegation Paragraph"]).toEqual(allegation2.paragraph);
        expect(record2["Allegation Directive"]).toEqual(allegation2.directive);
        expect(record2["Allegation Details"]).toEqual(
          officerAllegation2.details
        );
      });
  });
});
