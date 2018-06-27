import {
  buildTokenWithPermissions,
  cleanupDatabase
} from "../../../requestTestHelpers";
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
import { TIMEZONE } from "../../../../sharedUtilities/constants";
import parse from "csv-parse/lib/sync";
import Address from "../../../../client/testUtilities/Address";

describe("exportCases request", function() {
  let token, caseToExport, civilian;
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
      .withCreatedAt("2018/01/01 11:12:33");

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
    const caseOfficer = await models.case_officer.create(
      caseOfficerAttributes,
      { auditUser: "tuser" }
    );

    const allegationAttributes = new Allegation.Builder()
      .defaultAllegation()
      .withId(undefined);
    const allegation = await models.allegation.create(allegationAttributes, {
      auditUser: "tuser"
    });

    const officerAllegationAttributes = new OfficerAllegation.Builder()
      .defaultOfficerAllegation()
      .withId(undefined)
      .withAllegationId(allegation.id)
      .withCaseOfficerId(caseOfficer.id);
    const officerAllegation = await models.officer_allegation.create(
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
              "Notes (complainant)"
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
      });
  });

  test("should retrieve civilian data", async () => {
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
});
