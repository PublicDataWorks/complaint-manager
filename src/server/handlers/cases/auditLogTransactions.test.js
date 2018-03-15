import Case from "../../../client/testUtilities/case";
import Civilian from "../../../client/testUtilities/civilian";
import editCivilian from "../../../client/cases/thunks/editCivilian";

const httpMocks = require('node-mocks-http')
const createCase = require('./createCase')
const updateCaseNarrative = require('./updateCaseNarrative')
const models = require('../../models')

describe('transactions', () => {
    test('should not create case when audit logging fails', async () => {
        const requestWithBadDataForAudit = httpMocks.createRequest({
            method: 'POST',
            headers: {
                authorization: 'Bearer SOME_MOCK_TOKEN'
            },
            body: {
                case: {
                    complainantType: "Civilian",
                    firstContactDate: "2018-02-08",
                    createdBy: 'test_user',
                    assignedTo: 'test_user'
                },
                civilian: {
                    firstName: "First",
                    lastName: "Last",
                    phoneNumber: "1234567890"
                }
            },
            nickname: null
        })
        const response = httpMocks.createResponse()

        const expectedNumCases = await models.cases.count()

        await createCase(requestWithBadDataForAudit, response, jest.fn())

        const actualNumCases = await models.cases.count()

        expect(expectedNumCases).toEqual(actualNumCases)
    })

    test('should not update narrative if audit log fails', async () => {
        const caseToCreate = new Case.Builder().defaultCase()
            .withId(undefined)
            .withNarrative('initial narrative')
            .build()
        const caseToUpdate = await models.cases.create(caseToCreate)

        const requestWithBadDataForAudit = httpMocks.createRequest({
            method: 'PUT',
            headers: {
                authorization: 'Bearer SOME_MOCK_TOKEN'
            },
            body: {
                narrative: 'updated narrative'
            },
            params: {
                id: caseToUpdate.id
            },
            nickname: null
        })
        const response = httpMocks.createResponse()

        await updateCaseNarrative(requestWithBadDataForAudit, response, jest.fn())

        const updatedCase = await models.cases.findById(caseToUpdate.id)

        expect(updatedCase.narrative).toEqual('initial narrative')

        await models.cases.destroy({where: {id: updatedCase.id}})
    })

    test('should not update civilian if audit log fails', async () => {
        const caseToCreate = new Case.Builder().defaultCase()
            .withId(undefined)
            .withNarrative('initial narrative')
            .withCivilians([new Civilian.Builder().defaultCivilian().withId(undefined).withFirstName('Original').build()])
            .build()

        const caseToUpdate = await models.cases.create(caseToCreate, {include: [{model: models.civilian}]})
        const civilianToUpdate = caseToUpdate.civilians[0]

        const requestWithBadDataForAudit = httpMocks.createRequest({
            method: 'PUT',
            headers: {
                authorization: 'Bearer SOME_MOCK_TOKEN'
            },
            body: {
                firstName: 'Updated'
            },
            params: {
                id: civilianToUpdate.id
            },
            nickname: null
        })
        const response = httpMocks.createResponse()

        await editCivilian(requestWithBadDataForAudit, response, jest.fn())

        const updatedCivilian = await models.civilian.findById(civilianToUpdate.id)

        expect(updatedCivilian.firstName).toEqual('Original')

        await models.civilian.destroy({where: {id: updatedCivilian.id}})
        await models.cases.destroy({where: {id: caseToUpdate.id}})
    })

    //TODO add audit log transaction test for upload attachment
});