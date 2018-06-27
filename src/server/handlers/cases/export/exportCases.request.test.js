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

describe("exportCases request", function() {
  let token;
  beforeEach(() => {
    token = buildTokenWithPermissions("", "tuser");
  });
  afterEach(async () => {
    await cleanupDatabase();
  });
  test("should retrieve case data", async () => {
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
    const caseToExport = await models.cases.create(caseAttributes, {
      auditUser: "tuser",
      include: [
        { model: models.address, as: "incidentLocation", auditUser: "tuser" }
      ]
    });

    const civilianAttributes = new Civilian.Builder()
      .defaultCivilian()
      .withId(undefined)
      .withCaseId(caseToExport.id);
    const civilian = await models.civilian.create(civilianAttributes, {
      auditUser: "tuser"
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
            `Case #,Case Status,Created by,Created on,First Contact Date,Incident Date,` +
              `Incident Time,Incident Address,Incident City,Incident State,Incident Zip Code,Incident District,` +
              `Additional Incident Location Info\n` +
              `${caseToExport.id},${caseToExport.status},${
                caseToExport.createdBy
              },${moment(caseToExport.createdAt)
                .tz(TIMEZONE)
                .format("MM/DD/YYYY HH:mm:ss ")},${moment(
                caseToExport.firstContactDate
              ).format("MM/DD/YYYY")},` +
              `${moment(caseToExport.incidentDate).format(
                "MM/DD/YYYY"
              )},${moment(caseToExport.incidentTime, "HH:mm:ss").format(
                "HH:mm:ss"
              )},${caseToExport.incidentLocation.streetAddress},` +
              `${caseToExport.incidentLocation.city},${
                caseToExport.incidentLocation.state
              },${caseToExport.incidentLocation.zipCode},` +
              `${caseToExport.district},${
                caseToExport.incidentLocation.streetAddress2
              }\n`
          )
        );
      });
  });
});
