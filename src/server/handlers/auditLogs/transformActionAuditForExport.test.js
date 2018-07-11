import ActionAudit from "../../../client/testUtilities/ActionAudit";
import { AUDIT_SUBJECT, AUDIT_TYPE } from "../../../sharedUtilities/constants";
const transformActionAuditForExport = require("./transformActionAuditForExport");

describe("transformActionAuditForExport", () => {
  test("should transform officer detail and allegation audits or for export ", () => {
    const allegationActionAudit = new ActionAudit.Builder()
      .defaultActionAudit()
      .withSubject(AUDIT_SUBJECT.OFFICER_ALLEGATIONS)
      .withSubjectDetails("some name")
      .build();

    const officerDetailsActionAudit = new ActionAudit.Builder()
      .defaultActionAudit()
      .withSubject(AUDIT_SUBJECT.OFFICER_DETAILS)
      .withSubjectDetails("some name")
      .build();

    const transformedAudits = transformActionAuditForExport([
      allegationActionAudit,
      officerDetailsActionAudit
    ]);

    expect(transformedAudits).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          snapshot: `Viewed Officer ${allegationActionAudit.subjectDetails}`
        }),
        expect.objectContaining({
          snapshot: `Viewed Officer ${officerDetailsActionAudit.subjectDetails}`
        })
      ])
    );
  });

  test("should not have a snapshot if action is not a page view", () => {
    const authAction = new ActionAudit.Builder()
      .defaultActionAudit()
      .withAuditType(AUDIT_TYPE.AUTHENTICATION)
      .build();

    const exportAction = new ActionAudit.Builder()
      .defaultActionAudit()
      .withAuditType(AUDIT_TYPE.EXPORT)
      .build();

    const transformedAudits = transformActionAuditForExport([
      authAction,
      exportAction
    ]);

    expect(transformedAudits).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ snapshot: "" }),
        expect.objectContaining({ snapshot: "" })
      ])
    );
  });

  test("should not have a snapshot if viewing case details, officer search, case history ", () => {
    const caseDetailsActionAudit = new ActionAudit.Builder()
      .defaultActionAudit()
      .withSubject(AUDIT_SUBJECT.CASE_DETAILS)
      .withAuditType(AUDIT_TYPE.PAGE_VIEW)
      .build();

    const officerSearchActionAudit = new ActionAudit.Builder()
      .defaultActionAudit()
      .withSubject(AUDIT_SUBJECT.OFFICER_SEARCH)
      .withAuditType(AUDIT_TYPE.PAGE_VIEW)
      .build();

    const caseHistoryActionAudit = new ActionAudit.Builder()
      .defaultActionAudit()
      .withSubject(AUDIT_SUBJECT.CASE_HISTORY)
      .withAuditType(AUDIT_TYPE.PAGE_VIEW)
      .build();

    const transformedAudits = transformActionAuditForExport([
      caseDetailsActionAudit,
      officerSearchActionAudit,
      caseHistoryActionAudit
    ]);

    expect(transformedAudits).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ snapshot: "" }),
        expect.objectContaining({ snapshot: "" }),
        expect.objectContaining({ snapshot: "" })
      ])
    );
  });
});
