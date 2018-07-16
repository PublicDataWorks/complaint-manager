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
import timezone from "moment-timezone";
import {
  COMPLAINANT,
  TIMEZONE,
  WITNESS
} from "../../../../sharedUtilities/constants";
import parse from "csv-parse/lib/sync";
import Address from "../../../../client/testUtilities/Address";
import Attachment from "../../../../client/testUtilities/attachment";

describe("exportCases request", function() {
  let token,
    caseToExport,
    civilian,
    officer,
    caseOfficer,
    allegation,
    officerAllegation;
  beforeEach(async () => {
    token = buildTokenWithPermissions("", "tuser");

    const officerAttributes = new Officer.Builder()
      .defaultOfficer()
      .withId(undefined);
    officer = await models.officer.create(officerAttributes, {
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
              "Incident Intersection," +
              "Incident City," +
              "Incident State," +
              "Incident Zip Code," +
              "Incident District," +
              "Additional Incident Location Info," +
              "Complaint Type," +
              "Complainant," +
              "Civilian Complainant Name," +
              "Civilian Complainant Gender Identity," +
              "Civilian Complainant Race/Ethnicity," +
              "Civilian Complainant Age," +
              "Civilian Complainant Phone Number," +
              "Civilian Complainant Email," +
              "Civilian Complainant Address," +
              "Civilian Complainant City," +
              "Civilian Complainant State," +
              "Civilian Complainant Zip Code," +
              "Civilian Complainant Additional Address Information," +
              "Civilian Complainant Notes," +
              "Officer Complainant Name," +
              "Officer Complainant Windows Username," +
              "Officer Complainant Rank/Title," +
              "Officer Complainant Supervisor Name," +
              "Officer Complainant Supervisor Windows Username," +
              "Officer Complainant Employee Type," +
              "Officer Complainant District," +
              "Officer Complainant Bureau," +
              "Officer Complainant Status," +
              "Officer Complainant Hire Date," +
              "Officer Complainant End of Employment," +
              "Officer Complainant Race," +
              "Officer Complainant Sex," +
              "Officer Complainant Age," +
              "Officer Complainant Notes," +
              "Number of Witnesses," +
              "Witnesses," +
              "Narrative Summary," +
              "Narrative Details," +
              "Accused Officer Name," +
              "Accused Officer Windows Username," +
              "Accused Officer Rank/Title," +
              "Accused Officer Supervisor Name," +
              "Accused Officer Supervisor Windows Username," +
              "Accused Officer Employee Type," +
              "Accused Officer District," +
              "Accused Officer Bureau," +
              "Accused Officer Status," +
              "Accused Officer Hire Date," +
              "Accused Officer End of Employment," +
              "Accused Officer Race," +
              "Accused Officer Sex," +
              "Accused Officer Age," +
              "Accused Officer Notes," +
              "Allegation Rule," +
              "Allegation Paragraph," +
              "Allegation Directive," +
              "Allegation Details," +
              "Types of Attachments\n"
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
            .format("MM/DD/YYYY HH:mm:ss zz")
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
        expect(records[0]["Incident Intersection"]).toEqual(
          caseToExport.incidentLocation.intersection
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

  test("should retrieve civilian complainant data", async () => {
    await request(app)
      .get("/api/cases/export")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then(response => {
        const resultingCsv = response.text;
        const records = parse(resultingCsv, { columns: true });
        expect(records[0]["Complainant"]).toEqual("Civilian");
        expect(records[0]["Civilian Complainant Name"]).toEqual(
          `${civilian.firstName} ${civilian.middleInitial} ${
            civilian.lastName
          } ${civilian.suffix}`
        );
        expect(records[0]["Civilian Complainant Gender Identity"]).toEqual(
          civilian.genderIdentity
        );
        expect(records[0]["Civilian Complainant Race/Ethnicity"]).toEqual(
          civilian.raceEthnicity
        );
        const expectedAge = `${moment().diff(
          civilian.birthDate,
          "years",
          false
        )}`;
        expect(records[0]["Civilian Complainant Age"]).toEqual(expectedAge);
        expect(records[0]["Civilian Complainant Phone Number"]).toEqual(
          civilian.phoneNumber
        );
        expect(records[0]["Civilian Complainant Email"]).toEqual(
          civilian.email
        );
        expect(records[0]["Civilian Complainant Address"]).toEqual(
          civilian.address.streetAddress
        );
        expect(records[0]["Civilian Complainant City"]).toEqual(
          civilian.address.city
        );
        expect(records[0]["Civilian Complainant State"]).toEqual(
          civilian.address.state
        );
        expect(records[0]["Civilian Complainant Zip Code"]).toEqual(
          civilian.address.zipCode
        );
        expect(
          records[0]["Civilian Complainant Additional Address Information"]
        ).toEqual(civilian.address.streetAddress2);
        expect(records[0]["Civilian Complainant Notes"]).toEqual(
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

        expect(firstRecord["Civilian Complainant Name"]).toEqual(
          `${civilian.firstName} ${civilian.middleInitial} ${
            civilian.lastName
          } ${civilian.suffix}`
        );
        expect(firstRecord["Case #"]).toEqual(caseToExport.id.toString());

        expect(secondRecord["Civilian Complainant Name"]).toEqual(
          `${civilian2.firstName} ${civilian2.middleInitial} ${
            civilian2.lastName
          } ${civilian2.suffix}`
        );
        expect(secondRecord["Case #"]).toEqual(caseToExport.id.toString());
      });
  });

  test("should retrieve civilian complainant + officer complainant data", async () => {
    const officerComplainantAttributes = new Officer.Builder()
      .defaultOfficer()
      .withFirstName("Jasmine")
      .withLastName("Grace")
      .withOfficerNumber(officer.officerNumber + 5)
      .withId(undefined);
    const officerComplainant = await models.officer.create(
      officerComplainantAttributes,
      {
        auditUser: "tuser"
      }
    );
    const caseOfficerComplainantAttributes = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withOfficerAttributes(officerComplainant)
      .withNotes("hello")
      .withCaseId(caseToExport.id)
      .withRoleOnCase(COMPLAINANT);
    const caseOfficerComplainant = await models.case_officer.create(
      caseOfficerComplainantAttributes,
      { auditUser: "tuser" }
    );

    await request(app)
      .get("/api/cases/export")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then(response => {
        const resultingCsv = response.text;
        const records = parse(resultingCsv, { columns: true });
        expect(records.length).toEqual(2);

        const officerComplainantRow = records[1];
        expect(officerComplainantRow["Complainant"]).toEqual("Officer");
        expect(officerComplainantRow["Officer Complainant Name"]).toEqual(
          `${caseOfficerComplainant.firstName} ${
            caseOfficerComplainant.middleName
          } ${caseOfficerComplainant.lastName}`
        );
        expect(
          officerComplainantRow["Officer Complainant Windows Username"]
        ).toEqual(`${caseOfficerComplainant.windowsUsername}`);
        expect(officerComplainantRow["Officer Complainant Rank/Title"]).toEqual(
          caseOfficerComplainant.rank
        );
        expect(
          officerComplainantRow["Officer Complainant Supervisor Name"]
        ).toEqual(
          `${caseOfficerComplainant.supervisorFirstName} ${
            caseOfficerComplainant.supervisorMiddleName
          } ${caseOfficerComplainant.supervisorLastName}`
        );
        expect(
          officerComplainantRow[
            "Officer Complainant Supervisor Windows Username"
          ]
        ).toEqual(`${caseOfficerComplainant.supervisorWindowsUsername}`);
        expect(
          officerComplainantRow["Officer Complainant Employee Type"]
        ).toEqual(caseOfficerComplainant.employeeType);
        expect(officerComplainantRow["Officer Complainant District"]).toEqual(
          caseOfficerComplainant.district
        );
        expect(officerComplainantRow["Officer Complainant Bureau"]).toEqual(
          caseOfficerComplainant.bureau
        );
        expect(officerComplainantRow["Officer Complainant Status"]).toEqual(
          caseOfficerComplainant.workStatus
        );
        expect(officerComplainantRow["Officer Complainant Hire Date"]).toEqual(
          moment(caseOfficerComplainant.hireDate).format("MM/DD/YYYY")
        );
        expect(
          officerComplainantRow["Officer Complainant End of Employment"]
        ).toEqual(moment(caseOfficerComplainant.endDate).format("MM/DD/YYYY"));
        expect(officerComplainantRow["Officer Complainant Race"]).toEqual(
          caseOfficerComplainant.race
        );
        expect(officerComplainantRow["Officer Complainant Sex"]).toEqual(
          caseOfficerComplainant.sex
        );
        const expectedAge = `${moment().diff(
          caseOfficerComplainant.dob,
          "years",
          false
        )}`;
        expect(officerComplainantRow["Officer Complainant Age"]).toEqual(
          expectedAge
        );
        expect(officerComplainantRow["Officer Complainant Notes"]).toEqual(
          caseOfficerComplainant.notes
        );

        expect(officerComplainantRow["Civilian Complainant Name"]).toEqual("");

        const civilianComplainantRow = records[0];
        expect(civilianComplainantRow["Civilian Complainant Name"]).toEqual(
          `${civilian.firstName} ${civilian.middleInitial} ${
            civilian.lastName
          } ${civilian.suffix}`
        );
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
        expect(firstRecord["Accused Officer Name"]).toEqual(
          `${caseOfficer.firstName} ${caseOfficer.middleName} ${
            caseOfficer.lastName
          }`
        );
        expect(firstRecord["Accused Officer Windows Username"]).toEqual(
          caseOfficer.windowsUsername.toString()
        );
        expect(firstRecord["Accused Officer Rank/Title"]).toEqual(
          caseOfficer.rank
        );
        expect(firstRecord["Accused Officer Supervisor Name"]).toEqual(
          `${caseOfficer.supervisorFirstName} ${
            caseOfficer.supervisorMiddleName
          } ${caseOfficer.supervisorLastName}`
        );
        expect(
          firstRecord["Accused Officer Supervisor Windows Username"]
        ).toEqual(caseOfficer.supervisorWindowsUsername.toString());
        expect(firstRecord["Accused Officer Employee Type"]).toEqual(
          caseOfficer.employeeType
        );
        expect(firstRecord["Accused Officer District"]).toEqual(
          caseOfficer.district
        );
        expect(firstRecord["Accused Officer Bureau"]).toEqual(
          caseOfficer.bureau
        );
        expect(firstRecord["Accused Officer Status"]).toEqual(
          caseOfficer.workStatus
        );
        expect(firstRecord["Accused Officer Hire Date"]).toEqual(
          moment(caseOfficer.hireDate).format("MM/DD/YYYY")
        );
        expect(firstRecord["Accused Officer End of Employment"]).toEqual(
          moment(caseOfficer.endDate).format("MM/DD/YYYY")
        );
        expect(firstRecord["Accused Officer Race"]).toEqual(caseOfficer.race);
        expect(firstRecord["Accused Officer Sex"]).toEqual(caseOfficer.sex);
        const expectedAge = moment().diff(caseOfficer.dob, "years", false);
        expect(firstRecord["Accused Officer Age"]).toEqual(
          expectedAge.toString()
        );
        expect(firstRecord["Accused Officer Notes"]).toEqual(caseOfficer.notes);
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

        expect(firstRecord["Accused Officer Name"]).toEqual(
          caseOfficer.fullName
        );
        expect(firstRecord["Accused Officer Windows Username"]).toEqual(
          caseOfficer.windowsUsername.toString()
        );
        expect(firstRecord["Case #"]).toEqual(caseOfficer.caseId.toString());
        expect(secondRecord["Accused Officer Name"]).toEqual(
          caseOfficer2.fullName
        );
        expect(secondRecord["Accused Officer Windows Username"]).toEqual(
          caseOfficer2.windowsUsername.toString()
        );
        expect(secondRecord["Case #"]).toEqual(caseOfficer2.caseId.toString());
      });
  });

  test("exports officers from two different cases", async () => {
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
        expect(firstRecord["Accused Officer Name"]).toEqual(
          caseOfficer.fullName
        );
        expect(firstRecord["Accused Officer Windows Username"]).toEqual(
          caseOfficer.windowsUsername.toString()
        );

        expect(secondRecord["Case #"]).toEqual(otherCase.id.toString());
        expect(secondRecord["Accused Officer Name"]).toEqual(
          caseOfficer2.fullName
        );
        expect(secondRecord["Accused Officer Windows Username"]).toEqual(
          caseOfficer2.windowsUsername.toString()
        );
      });
  });

  test("creates 4 rows for 2 civilian complainants and 2 accused officers", async () => {
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
        expect(firstRecord["Civilian Complainant Name"]).toEqual(
          `${civilian.firstName} ${civilian.middleInitial} ${
            civilian.lastName
          } ${civilian.suffix}`
        );
        expect(firstRecord["Accused Officer Name"]).toEqual(
          caseOfficer.fullName
        );
        expect(firstRecord["Accused Officer Windows Username"]).toEqual(
          caseOfficer.windowsUsername.toString()
        );

        expect(secondRecord["Case #"]).toEqual(caseToExport.id.toString());
        expect(secondRecord["Civilian Complainant Name"]).toEqual(
          `${civilian.firstName} ${civilian.middleInitial} ${
            civilian.lastName
          } ${civilian.suffix}`
        );
        expect(secondRecord["Accused Officer Name"]).toEqual(
          caseOfficer2.fullName
        );
        expect(secondRecord["Accused Officer Windows Username"]).toEqual(
          caseOfficer2.windowsUsername.toString()
        );

        expect(thirdRecord["Case #"]).toEqual(caseToExport.id.toString());
        expect(thirdRecord["Civilian Complainant Name"]).toEqual(
          `${civilian2.firstName} ${civilian2.middleInitial} ${
            civilian2.lastName
          } ${civilian2.suffix}`
        );
        expect(thirdRecord["Accused Officer Name"]).toEqual(
          caseOfficer.fullName
        );
        expect(thirdRecord["Accused Officer Windows Username"]).toEqual(
          caseOfficer.windowsUsername.toString()
        );

        expect(fourthRecord["Case #"]).toEqual(caseToExport.id.toString());
        expect(fourthRecord["Civilian Complainant Name"]).toEqual(
          `${civilian2.firstName} ${civilian2.middleInitial} ${
            civilian2.lastName
          } ${civilian2.suffix}`
        );
        expect(fourthRecord["Accused Officer Name"]).toEqual(
          caseOfficer2.fullName
        );
        expect(fourthRecord["Accused Officer Windows Username"]).toEqual(
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

  test("should include list of attachment file types in case data", async () => {
    const extension1 = "pdf";
    const extension2 = "mp4";
    const extension3 = "csv";

    const attachmentAttributes1 = new Attachment.Builder()
      .defaultAttachment()
      .withId(undefined)
      .withCaseId(caseToExport.id)
      .withFileName(`Attachment1.${extension1}`);
    const attachmentAttributes2 = new Attachment.Builder()
      .defaultAttachment()
      .withId(undefined)
      .withCaseId(caseToExport.id)
      .withFileName(`Attachment2.${extension2}`);
    const attachmentAttributes3 = new Attachment.Builder()
      .defaultAttachment()
      .withId(undefined)
      .withCaseId(caseToExport.id)
      .withFileName(`Attachment3.${extension3}`);

    await models.attachment.bulkCreate([
      attachmentAttributes1,
      attachmentAttributes2,
      attachmentAttributes3
    ]);

    await request(app)
      .get("/api/cases/export")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then(response => {
        const resultingCsv = response.text;
        const records = parse(resultingCsv, { columns: true });

        expect(records.length).toEqual(1);

        const record1 = records[0];
        const extension1Matcher = expect.stringMatching(/^pdf\b|\spdf\b/);
        const extension2Matcher = expect.stringMatching(/^mp4\b|\smp4\b/);
        const extension3Matcher = expect.stringMatching(/^csv\b|\scsv\b/);

        expect(record1["Types of Attachments"]).toEqual(extension1Matcher);
        expect(record1["Types of Attachments"]).toEqual(extension2Matcher);
        expect(record1["Types of Attachments"]).toEqual(extension3Matcher);
      });
  });

  test("should display correct timezone", async () => {
    await request(app)
      .get("/api/cases/export")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then(response => {
        const resultingCsv = response.text;
        const records = parse(resultingCsv, { columns: true });

        expect(records.length).toEqual(1);

        const record1 = records[0];
        const expectedTimestampString = timezone(caseToExport.createdAt)
          .tz(TIMEZONE)
          .format("MM/DD/YYYY HH:mm:ss zz");

        expect(record1["Created on"]).toEqual(expectedTimestampString);
      });
  });
});
