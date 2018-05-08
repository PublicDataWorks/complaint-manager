import Case from "../../../client/testUtilities/case";
import models from "../../models";
import addCaseOfficer from "./addCaseOfficer";
import * as httpMocks from "node-mocks-http";

describe("addOfficer", () => {
    test("should change the status when unknown case officer created", async () => {
        const caseToCreate = new Case.Builder()
            .defaultCase()
            .withId(undefined)
            .withStatus("Initial")
            .withIncidentLocation(undefined);

        const createdCase = await models.cases.create(caseToCreate);

        const request = httpMocks.createRequest({
            method: "POST",
            headers: {
                authorization: "Bearer SOME_MOCK_TOKEN"
            },
            params: {
                caseId: createdCase.id
            },
            body: {
                officerId: null,
                roleOnCase: "Accused",
                notes: "these are notes"
            },
            nickname: "TEST_USER_NICKNAME"
        });

        const response = httpMocks.createResponse();

        await addCaseOfficer(request, response, jest.fn());

        const caseOfInterest = await models.cases.findById(createdCase.id);
        expect(caseOfInterest).toEqual(
            expect.objectContaining({
                status: "Active"
            })
        );
    });
});
