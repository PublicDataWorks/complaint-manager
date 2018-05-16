import buildTokenWithPermissions from "../../../requestTestHelpers";
import Case from "../../../../client/testUtilities/case";
import DataChangeAudit from "../../../../client/testUtilities/dataChangeAudit"
import models from '../../../models/index';
import {DATA_UPDATED} from "../../../../sharedUtilities/constants";
import _ from 'lodash';
import request from 'supertest';
import app from '../../../server';

describe("GET /api/cases/:caseId/case-history", () => {

    afterEach(async () => {
        await models.cases.truncate({cascade: true});
        await models.data_change_audit.truncate({cascade: true});
    });

    test("it returns the case history ordered by createdAt desc", async () => {
       const token = buildTokenWithPermissions("", "bobNickname");
       const caseAttributes = new Case.Builder().defaultCase().withId(undefined).withIncidentLocation(undefined);
       const existingCase = await models.cases.create(caseAttributes);

       const dataChangeAuditAttributes = new DataChangeAudit.Builder().defaultDataChangeAudit()
           .withId(undefined).withModelName('case').withModelId(existingCase.id).withCaseId(existingCase.id)
           .withAction(DATA_UPDATED).withChanges({}).withUser('bob');
       const dataChangeAudit = await models.data_change_audit.create(dataChangeAuditAttributes);

       const expectedAuditProperties = _.pick(dataChangeAudit, ['id', 'caseId', 'action', 'modelName', 'modelId', 'changes', 'user', 'createdAt']);
       expectedAuditProperties['createdAt'] = dataChangeAudit.createdAt.toJSON();

       await request(app)
           .get(`/api/cases/${existingCase.id}/case-history`)
           .set("Authorization", `Bearer ${token}`)
           .set("Content-Type", "application/json")
           .expect(200)
           .then(response => {
               expect(response.body).toEqual([expectedAuditProperties])
           })
   });

});