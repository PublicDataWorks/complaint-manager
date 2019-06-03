import {
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  AUDIT_TYPE,
  TIMEZONE
} from "../../../sharedUtilities/constants";
import moment from "moment-timezone";
import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import models from "../../../server/models";
import {
  transformNewDataAccessAuditsToOld,
  transformOldDataAccessAuditsToNew,
  transformSingleNewAuditToOld,
  transformSingleOldAuditToNew
} from "./transformDataAccessAudits";

describe("transform data access audits", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  const testUser = "Gary the SNAIL";
  const testSubject = "TEST_SUBJECT";

  describe("transformOldDataAccessAuditsToNew", () => {
    test("should transform audits that are after legacy audit time", async () => {
      const legacyCreatedAtTime = moment.tz("2019-02-24 05:12:12", TIMEZONE);
      await models.action_audit.create({
        action: AUDIT_ACTION.DATA_ACCESSED,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        user: testUser,
        caseId: null,
        subject: testSubject,
        auditDetails: {
          Case: ["All Case Data"]
        },
        createdAt: legacyCreatedAtTime
      });
      const firstCreatedAtTime = moment.tz("2019-05-28 05:12:12", TIMEZONE);
      await models.action_audit.create({
        action: AUDIT_ACTION.DATA_ACCESSED,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        user: testUser,
        caseId: null,
        subject: testSubject,
        auditDetails: {
          Case: ["All Case Data"]
        },
        createdAt: firstCreatedAtTime
      });

      const middleCreatedAtTime = moment.tz("2019-05-28 05:13:12", TIMEZONE);
      await models.action_audit.create({
        action: AUDIT_ACTION.DATA_ACCESSED,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        user: testUser,
        caseId: null,
        subject: testSubject,
        auditDetails: {
          "Complainant Civilians": ["All Complainant Civilians Data"]
        },
        createdAt: middleCreatedAtTime
      });

      const lastCreatedAtTime = moment.tz("2019-05-28 05:14:12", TIMEZONE);
      await models.action_audit.create({
        action: AUDIT_ACTION.DATA_ACCESSED,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        user: testUser,
        caseId: null,
        subject: testSubject,
        auditDetails: {
          "Case Note": ["All Case Note Data"]
        },
        createdAt: lastCreatedAtTime
      });

      await models.sequelize.transaction(async transaction => {
        await transformOldDataAccessAuditsToNew(transaction);
      });

      const audits = await models.audit.findAll({
        include: [
          {
            model: models.data_access_audit,
            as: "dataAccessAudit",
            include: [
              {
                model: models.data_access_value,
                as: "dataAccessValues"
              }
            ]
          }
        ]
      });

      expect(audits).toEqual(
        expect.toIncludeSameMembers([
          expect.objectContaining({
            auditAction: AUDIT_ACTION.DATA_ACCESSED,
            user: testUser,
            createdAt: new Date(firstCreatedAtTime),
            caseId: null,
            dataAccessAudit: expect.objectContaining({
              auditSubject: testSubject,
              dataAccessValues: expect.toIncludeSameMembers([
                expect.objectContaining({
                  association: "cases",
                  fields: Object.keys(models.cases.rawAttributes)
                })
              ])
            })
          }),
          expect.objectContaining({
            auditAction: AUDIT_ACTION.DATA_ACCESSED,
            user: testUser,
            createdAt: new Date(middleCreatedAtTime),
            caseId: null,
            dataAccessAudit: expect.objectContaining({
              auditSubject: testSubject,
              dataAccessValues: expect.toIncludeSameMembers([
                expect.objectContaining({
                  association: "complainantCivilians",
                  fields: Object.keys(models.civilian.rawAttributes)
                })
              ])
            })
          }),
          expect.objectContaining({
            auditAction: AUDIT_ACTION.DATA_ACCESSED,
            user: testUser,
            createdAt: new Date(lastCreatedAtTime),
            caseId: null,
            dataAccessAudit: expect.objectContaining({
              auditSubject: testSubject,
              dataAccessValues: expect.toIncludeSameMembers([
                expect.objectContaining({
                  association: "caseNote",
                  fields: Object.keys(models.case_note.rawAttributes)
                })
              ])
            })
          })
        ])
      );
    });

    describe("transformSingleOldAuditToNew", () => {
      describe("transform audits before migrations 20190228214806, 20190417204347, and 20190424221106", () => {
        test("should update cases, civilian, and case_note data correctly", async () => {
          const createdAtTime = moment.tz("0044-03-15 05:12:12", TIMEZONE);

          await models.action_audit.create({
            action: AUDIT_ACTION.DATA_ACCESSED,
            auditType: AUDIT_TYPE.DATA_ACCESS,
            user: testUser,
            caseId: null,
            subject: testSubject,
            auditDetails: {
              Case: ["All Case Data"],
              Civilian: ["All Civilian Data"],
              "Case Note": ["All Case Note Data"],
              "Witness Civilians": ["All Witness Civilians Data"],
              "Complainant Civilian": ["All Complainant Civilian Data"],
              "Complainant Civilians": ["All Complainant Civilians Data"]
            },
            createdAt: createdAtTime
          });

          const actionAudit = await models.action_audit.findOne();
          await models.sequelize.transaction(async transaction => {
            await transformSingleOldAuditToNew(actionAudit, transaction);
          });

          const audit = await models.audit.findOne({
            include: [
              {
                model: models.data_access_audit,
                as: "dataAccessAudit",
                include: [
                  {
                    model: models.data_access_value,
                    as: "dataAccessValues"
                  }
                ]
              }
            ]
          });

          const expectedCivilianFieldsBeforeMigration = expect.toIncludeSameMembers(
            [
              "id",
              "firstName",
              "middleInitial",
              "lastName",
              "suffix",
              "birthDate",
              "roleOnCase",
              "phoneNumber",
              "email",
              "additionalInfo",
              "title",
              "isAnonymous",
              "createdAt",
              "updatedAt",
              "deletedAt",
              "caseId",
              "raceEthnicityId",
              "genderIdentity"
            ]
          );

          const expectedCaseNoteFieldsBeforeMigration = expect.toIncludeSameMembers(
            [
              "id",
              "user",
              "actionTakenAt",
              "notes",
              "createdAt",
              "updatedAt",
              "deletedAt",
              "action",
              "caseId"
            ]
          );

          expect(audit).toEqual(
            expect.objectContaining({
              auditAction: AUDIT_ACTION.DATA_ACCESSED,
              user: testUser,
              createdAt: new Date(createdAtTime),
              caseId: null,
              dataAccessAudit: expect.objectContaining({
                auditSubject: testSubject,
                dataAccessValues: expect.toIncludeSameMembers([
                  expect.objectContaining({
                    association: "cases",
                    fields: expect.not.toIncludeAnyMembers([
                      "howDidYouHearAboutUsSourceId"
                    ])
                  }),
                  expect.objectContaining({
                    association: "civilian",
                    fields: expectedCivilianFieldsBeforeMigration
                  }),
                  expect.objectContaining({
                    association: "caseNote",
                    fields: expectedCaseNoteFieldsBeforeMigration
                  }),
                  expect.objectContaining({
                    association: "witnessCivilians",
                    fields: expectedCivilianFieldsBeforeMigration
                  }),
                  expect.objectContaining({
                    association: "complainantCivilian",
                    fields: expectedCivilianFieldsBeforeMigration
                  }),
                  expect.objectContaining({
                    association: "complainantCivilians",
                    fields: expectedCivilianFieldsBeforeMigration
                  })
                ])
              })
            })
          );
        });
      });

      test("should transform recent audit with Officers and Complainant Civilians", async () => {
        const createdAtTime = moment.tz("2019-05-28 05:12:12", TIMEZONE);

        await models.action_audit.create({
          action: AUDIT_ACTION.DATA_ACCESSED,
          auditType: AUDIT_TYPE.DATA_ACCESS,
          user: testUser,
          caseId: null,
          subject: testSubject,
          auditDetails: {
            Officer: ["All Officer Data"],
            "Complainant Civilians": ["All Complainant Civilians Data"]
          },
          createdAt: createdAtTime
        });

        const actionAudit = await models.action_audit.findOne();
        await models.sequelize.transaction(async transaction => {
          await transformSingleOldAuditToNew(actionAudit, transaction);
        });

        const audit = await models.audit.findOne({
          include: [
            {
              model: models.data_access_audit,
              as: "dataAccessAudit",
              include: [
                {
                  model: models.data_access_value,
                  as: "dataAccessValues"
                }
              ]
            }
          ]
        });

        expect(audit).toEqual(
          expect.objectContaining({
            auditAction: AUDIT_ACTION.DATA_ACCESSED,
            user: testUser,
            createdAt: new Date(createdAtTime),
            caseId: null,
            dataAccessAudit: expect.objectContaining({
              auditSubject: testSubject,
              dataAccessValues: [
                expect.objectContaining({
                  association: "officer",
                  fields: expect.toIncludeSameMembers([
                    "bureau",
                    "createdAt",
                    "district",
                    "dob",
                    "employeeType",
                    "endDate",
                    "firstName",
                    "hireDate",
                    "id",
                    "lastName",
                    "middleName",
                    "officerNumber",
                    "race",
                    "rank",
                    "sex",
                    "supervisorOfficerNumber",
                    "updatedAt",
                    "windowsUsername",
                    "workStatus"
                  ])
                }),
                expect.objectContaining({
                  association: "complainantCivilians",
                  fields: expect.toIncludeSameMembers([
                    "id",
                    "firstName",
                    "middleInitial",
                    "lastName",
                    "suffix",
                    "birthDate",
                    "roleOnCase",
                    "phoneNumber",
                    "email",
                    "additionalInfo",
                    "title",
                    "isAnonymous",
                    "createdAt",
                    "updatedAt",
                    "deletedAt",
                    "caseId",
                    "raceEthnicityId",
                    "genderIdentityId"
                  ])
                })
              ]
            })
          })
        );
      });

      test("should transform recent audit with All Referral Letter Data plus additional fields", async () => {
        const createdAtTime = moment.tz("2019-05-28 05:12:12", TIMEZONE);

        await models.action_audit.create({
          action: AUDIT_ACTION.DATA_ACCESSED,
          auditType: AUDIT_TYPE.DATA_ACCESS,
          user: testUser,
          caseId: null,
          subject: testSubject,
          auditDetails: {
            "Referral Letter": [
              "All Referral Letter Data",
              "Draft Filename",
              "Edit Status",
              "Last Edited"
            ]
          },
          createdAt: createdAtTime
        });

        const actionAudit = await models.action_audit.findOne();
        await models.sequelize.transaction(async transaction => {
          await transformSingleOldAuditToNew(actionAudit, transaction);
        });

        const audit = await models.audit.findOne({
          include: [
            {
              model: models.data_access_audit,
              as: "dataAccessAudit",
              include: [
                {
                  model: models.data_access_value,
                  as: "dataAccessValues"
                }
              ]
            }
          ]
        });

        expect(audit).toEqual(
          expect.objectContaining({
            auditAction: AUDIT_ACTION.DATA_ACCESSED,
            user: testUser,
            createdAt: new Date(createdAtTime),
            caseId: null,
            dataAccessAudit: expect.objectContaining({
              auditSubject: testSubject,
              dataAccessValues: [
                expect.objectContaining({
                  association: "referralLetter",
                  fields: expect.toIncludeSameMembers([
                    "id",
                    "caseId",
                    "includeRetaliationConcerns",
                    "recipient",
                    "sender",
                    "transcribedBy",
                    "editedLetterHtml",
                    "finalPdfFilename",
                    "createdAt",
                    "updatedAt",
                    "draftFilename",
                    "editStatus",
                    "lastEdited"
                  ])
                })
              ]
            })
          })
        );
      });

      test("should transform association that does not have a model", async () => {
        const createdAtTime = moment.tz("2019-05-28 05:12:12", TIMEZONE);

        await models.action_audit.create({
          action: AUDIT_ACTION.DATA_ACCESSED,
          auditType: AUDIT_TYPE.DATA_ACCESS,
          user: testUser,
          caseId: null,
          subject: testSubject,
          auditDetails: {
            "Earliest Added Complainant": [
              "First Name",
              "Middle Name",
              "Last Name",
              "Suffix",
              "Person Type"
            ]
          },
          createdAt: createdAtTime
        });

        const actionAudit = await models.action_audit.findOne();
        await models.sequelize.transaction(async transaction => {
          await transformSingleOldAuditToNew(actionAudit, transaction);
        });

        const audit = await models.audit.findOne({
          include: [
            {
              model: models.data_access_audit,
              as: "dataAccessAudit",
              include: [
                {
                  model: models.data_access_value,
                  as: "dataAccessValues"
                }
              ]
            }
          ]
        });

        expect(audit).toEqual(
          expect.objectContaining({
            auditAction: AUDIT_ACTION.DATA_ACCESSED,
            user: testUser,
            createdAt: new Date(createdAtTime),
            caseId: null,
            dataAccessAudit: expect.objectContaining({
              auditSubject: testSubject,
              dataAccessValues: [
                expect.objectContaining({
                  association: "earliestAddedComplainant",
                  fields: expect.toIncludeSameMembers([
                    "firstName",
                    "lastName",
                    "middleName",
                    "personType",
                    "suffix"
                  ])
                })
              ]
            })
          })
        );
      });
    });
  });

  describe("transformNewDataAccessAuditsToOld", () => {
    describe("transformSingleNewAuditToOld", () => {
      test("should transform new referral letter preview audit to action audit", async () => {
        const audit = await models.audit.create(
          {
            auditAction: AUDIT_ACTION.DATA_ACCESSED,
            caseId: null,
            user: testUser,
            createdAt: new Date("2019-04-28 17:03:51.26+00"),
            dataAccessAudit: {
              auditSubject: AUDIT_SUBJECT.REFERRAL_LETTER_PREVIEW,
              dataAccessValues: [
                {
                  association: "referralLetter",
                  fields: [
                    "id",
                    "caseId",
                    "includeRetaliationConcerns",
                    "recipient",
                    "sender",
                    "transcribedBy",
                    "editedLetterHtml",
                    "finalPdfFilename",
                    "createdAt",
                    "updatedAt",
                    "draftFilename",
                    "editStatus",
                    "lastEdited"
                  ]
                },
                {
                  association: "cases",
                  fields: [
                    "assignedTo",
                    "caseId",
                    "caseNumber",
                    "classificationId",
                    "complaintType",
                    "createdAt",
                    "createdBy",
                    "district",
                    "firstContactDate",
                    "howDidYouHearAboutUsSourceId",
                    "id",
                    "incidentDate",
                    "incidentTime",
                    "intakeSourceId",
                    "isArchived",
                    "narrativeDetails",
                    "narrativeSummary",
                    "pdfAvailable",
                    "pibCaseNumber",
                    "status",
                    "updatedAt",
                    "year"
                  ]
                },
                {
                  association: "address",
                  fields: [
                    "id",
                    "addressableId",
                    "addressableType",
                    "streetAddress",
                    "intersection",
                    "streetAddress2",
                    "city",
                    "state",
                    "zipCode",
                    "country",
                    "lat",
                    "lng",
                    "placeId",
                    "additionalLocationInfo",
                    "createdAt",
                    "updatedAt",
                    "deletedAt"
                  ]
                }
              ]
            }
          },
          {
            include: [
              {
                model: models.data_access_audit,
                as: "dataAccessAudit",
                include: [
                  { model: models.data_access_value, as: "dataAccessValues" }
                ]
              }
            ]
          }
        );

        await models.sequelize.transaction(async transaction => {
          await transformSingleNewAuditToOld(audit, transaction);
        });

        const actionAudit = await models.action_audit.findOne();

        expect(actionAudit).toEqual(
          expect.objectContaining({
            auditType: AUDIT_TYPE.DATA_ACCESS,
            user: testUser,
            caseId: null,
            subject: AUDIT_SUBJECT.REFERRAL_LETTER_PREVIEW,
            auditDetails: {
              Case: [
                "Assigned To",
                "Case Id",
                "Case Number",
                "Classification Id",
                "Complaint Type",
                "Created At",
                "Created By",
                "District",
                "First Contact Date",
                "How Did You Hear About Us Source Id",
                "Id",
                "Incident Date",
                "Incident Time",
                "Intake Source Id",
                "Is Archived",
                "Narrative Details",
                "Narrative Summary",
                "Pdf Available",
                "Pib Case Number",
                "Status",
                "Updated At",
                "Year"
              ],
              Address: ["All Address Data"],
              "Referral Letter": [
                "All Referral Letter Data",
                "Draft Filename",
                "Edit Status",
                "Last Edited"
              ]
            },
            createdAt: audit.createdAt
          })
        );
      });

      test("should transform all working cases audit to action audit", async () => {
        const audit = await models.audit.create(
          {
            auditAction: AUDIT_ACTION.DATA_ACCESSED,
            caseId: null,
            user: testUser,
            createdAt: new Date("2019-04-28 17:03:51.26+00"),
            dataAccessAudit: {
              auditSubject: AUDIT_SUBJECT.REFERRAL_LETTER_PREVIEW,
              dataAccessValues: [
                {
                  association: "earliestAddedAccusedOfficer",
                  fields: ["firstName", "lastName", "middleName", "personType"]
                },
                {
                  association: "earliestAddedComplainant",
                  fields: [
                    "firstName",
                    "lastName",
                    "middleName",
                    "personType",
                    "suffix"
                  ]
                },
                {
                  association: "cases",
                  fields: [
                    "assignedTo",
                    "caseNumber",
                    "complaintType",
                    "deletedAt",
                    "firstContactDate",
                    "id",
                    "status",
                    "year"
                  ]
                }
              ]
            }
          },
          {
            include: [
              {
                model: models.data_access_audit,
                as: "dataAccessAudit",
                include: [
                  { model: models.data_access_value, as: "dataAccessValues" }
                ]
              }
            ]
          }
        );

        await models.sequelize.transaction(async transaction => {
          await transformSingleNewAuditToOld(audit, transaction);
        });

        const actionAudit = await models.action_audit.findOne();

        expect(actionAudit).toEqual(
          expect.objectContaining({
            auditType: AUDIT_TYPE.DATA_ACCESS,
            user: testUser,
            caseId: null,
            subject: AUDIT_SUBJECT.REFERRAL_LETTER_PREVIEW,
            auditDetails: {
              Case: expect.toIncludeSameMembers([
                "Id",
                "Status",
                "Assigned To",
                "Case Number",
                "Complaint Type",
                "Deleted At",
                "First Contact Date",
                "Year"
              ]),
              "Earliest Added Accused Officer": expect.toIncludeSameMembers([
                "First Name",
                "Middle Name",
                "Last Name",
                "Person Type"
              ]),
              "Earliest Added Complainant": expect.toIncludeSameMembers([
                "First Name",
                "Middle Name",
                "Last Name",
                "Suffix",
                "Person Type"
              ])
            },
            createdAt: audit.createdAt
          })
        );
      });
    });
    describe("transformNewDataAccessAuditsToOld", () => {
      test("should not transform new audit to old if old audit exists in action audit table", async () => {
        await models.action_audit.create({
          action: AUDIT_ACTION.DATA_ACCESSED,
          auditType: AUDIT_TYPE.DATA_ACCESS,
          user: testUser,
          caseId: null,
          subject: testSubject,
          auditDetails: {
            "Complainant Civilians": ["All Complainant Civilians Data"]
          },
          createdAt: moment.tz("2019-04-10 05:13:12", TIMEZONE)
        });

        await models.audit.create(
          {
            auditAction: AUDIT_ACTION.DATA_ACCESSED,
            user: testUser,
            caseId: null,
            dataAccessAudit: {
              auditSubject: AUDIT_SUBJECT.REFERRAL_LETTER_PREVIEW,
              dataAccessValues: [
                {
                  association: "cases",
                  fields: ["status", "id"]
                }
              ]
            }
          },
          {
            include: [
              {
                model: models.data_access_audit,
                as: "dataAccessAudit",
                include: [
                  {
                    model: models.data_access_value,
                    as: "dataAccessValues"
                  }
                ]
              }
            ]
          }
        );

        await models.sequelize.transaction(async transaction => {
          await transformOldDataAccessAuditsToNew(transaction);
        });

        await models.sequelize.transaction(async transaction => {
          await transformNewDataAccessAuditsToOld(transaction);
        });

        const actionAudits = await models.action_audit.findAll({});

        expect(actionAudits.length).toEqual(2);
      });

      test("should destroy audits from new audit table", async () => {
        await models.audit.create(
          {
            auditAction: AUDIT_ACTION.DATA_ACCESSED,
            user: testUser,
            caseId: null,
            dataAccessAudit: {
              auditSubject: AUDIT_SUBJECT.REFERRAL_LETTER_PREVIEW,
              dataAccessValues: [
                {
                  association: "cases",
                  fields: ["status", "id"]
                }
              ]
            }
          },
          {
            include: [
              {
                model: models.data_access_audit,
                as: "dataAccessAudit",
                include: [
                  {
                    model: models.data_access_value,
                    as: "dataAccessValues"
                  }
                ]
              }
            ]
          }
        );

        await models.sequelize.transaction(async transaction => {
          await transformNewDataAccessAuditsToOld(transaction);
        });

        const audits = await models.audit.findAll();
        const dataAccessAudits = await models.data_access_audit.findAll();
        const dataAccessValues = await models.data_access_value.findAll();

        expect(audits.length).toEqual(0);
        expect(dataAccessAudits.length).toEqual(0);
        expect(dataAccessValues.length).toEqual(0);
      });
    });
  });
});
