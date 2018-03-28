import Case from "../../../client/testUtilities/case";
import Civilian from "../../../client/testUtilities/civilian";
import editCivilian from "../../../client/cases/thunks/editCivilian";
import Attachment from "../../../client/testUtilities/attachment";
import AWS from "aws-sdk/index";
const httpMocks = require('node-mocks-http')
const createCase = require('./createCase')
const updateCaseNarrative = require('./updateCaseNarrative')
const deleteAttachment = require('../../handlers/cases/attachments/deleteAttachment')
const models = require('../../models')

jest.mock('aws-sdk', () => ({
        S3: jest.fn()
    })
)

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
                    incidentDate: "2018-03-16T16:59",
                    createdBy: 'test_transaction_user',
                    assignedTo: 'test_transaction_user'
                },
                civilian: {
                    firstName: "test_transaction_civilian",
                    lastName: "test_transaction_civilian",
                    phoneNumber: "1234567890"
                }
            },
            nickname: null
        })
        const response = httpMocks.createResponse()

        await createCase(requestWithBadDataForAudit, response, jest.fn())

        const expectedCase = await models.cases.findOne({ where: { createdBy: 'test_transaction_user' }})

        expect(expectedCase).toBeNull()

        await models.civilian.destroy({ where: { firstName: 'test_transaction_civilian' }})
        await models.cases.destroy({ where: { createdBy: 'test_transaction_user' }})
    })

    test('should not update narrative if audit log fails', async () => {
        const caseToCreate = new Case.Builder().defaultCase()
            .withId(undefined)
            .withNarrativeDetails('initial narrative')
            .build()
        const caseToUpdate = await models.cases.create(caseToCreate)

        const requestWithBadDataForAudit = httpMocks.createRequest({
            method: 'PUT',
            headers: {
                authorization: 'Bearer SOME_MOCK_TOKEN'
            },
            body: {
                narrativeDetails: 'updated narrative'
            },
            params: {
                id: caseToUpdate.id
            },
            nickname: null
        })
        const response = httpMocks.createResponse()

        await updateCaseNarrative(requestWithBadDataForAudit, response, jest.fn())

        const updatedCase = await models.cases.findById(caseToUpdate.id)

        expect(updatedCase.narrativeDetails).toEqual('initial narrative')

        await models.cases.destroy({where: {id: updatedCase.id}})
    })

    test('should not update civilian if audit log fails', async () => {
        const caseToCreate = new Case.Builder().defaultCase()
            .withId(undefined)
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

    describe('delete attachment from case', () => {
        let caseToUpdate

        beforeEach(async () => {
            const caseToCreate = new Case.Builder().defaultCase()
                .withId(undefined)
                .withCivilians([new Civilian.Builder().defaultCivilian().withId(undefined).withFirstName('Original').build()])
                .withAttachments([new Attachment.Builder().defaultAttachment().withId(undefined).withFileName('correct.jpg').build()])
                .build()

            caseToUpdate = await models.cases.create(caseToCreate, {include: [{model: models.civilian}, {model: models.attachment}]})

            AWS.S3.mockImplementation(() => {
                return {
                    deleteObject: (params, options) => ({
                        promise: () => Promise.resolve({})
                    }),
                    config: {
                        loadFromPath: jest.fn()
                    }
                }
            })
        })

        afterEach(async () => {
            await models.civilian.destroy({where: {caseId: caseToUpdate.id}})
            await models.audit_log.destroy({where: {caseId: caseToUpdate.id}})
            await models.attachment.destroy({where: {caseId: caseToUpdate.id}})
            await models.cases.destroy({where: {id: caseToUpdate.id}})
        })

        test('should not delete attachment if audit log fails', async () => {
            const requestWithBadDataForAudit = httpMocks.createRequest({
                method: 'DELETE',
                headers: {
                    authorization: 'Bearer SOME_MOCK_TOKEN'
                },
                params: {
                    id: caseToUpdate.id,
                    fileName: 'incorrect.jpg'
                },
                nickname: 'test username'
            })

            const response = httpMocks.createResponse()
            await deleteAttachment(requestWithBadDataForAudit, response, jest.fn())

            expect(response._getData().attachments.length).toEqual(1)
        })

        test('should log attachment removal in audit table', async () => {
            const requestWithValidDataForAudit = httpMocks.createRequest({
                method: 'DELETE',
                headers: {
                    authorization: 'Bearer SOME_MOCK_TOKEN'
                },
                params: {
                    id: caseToUpdate.id,
                    fileName: 'correct.jpg'
                },
                nickname: 'test username'
            })

            const response = httpMocks.createResponse()
            await deleteAttachment(requestWithValidDataForAudit, response, jest.fn())

            const log = await models.audit_log.findAll( { where: { caseId: caseToUpdate.id }})

            expect(response._getData().attachments.length).toEqual(0)
            expect(log[0].getDataValue('action')).toEqual('Attachment removed')
        })
    })
});
