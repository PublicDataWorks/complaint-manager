import AWS from "aws-sdk/index";
import app from "./server";
import Case from "../client/testUtilities/case";
import Civilian from "../client/testUtilities/civilian";
import request from "supertest";
import models from "./models";
import Attachment from "../client/testUtilities/attachment";
import {AuthenticationClient} from "auth0";
import fs from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'

const config = require('./config/config')[process.env.NODE_ENV]

jest.mock('auth0', () => ({
    AuthenticationClient: jest.fn()
}))

jest.mock('aws-sdk', () => ({
        S3: jest.fn()
    })
)

describe('attachment routes', () => {

    let token

    beforeEach(async () => {

        var privateKeyPath = path.join(__dirname, 'config', 'test', 'private.pem')
        var cert = fs.readFileSync(privateKeyPath)

        var payload = {
            foo: 'bar'
        }

        var options = {
            audience: config.authentication.audience,
            issuer: config.authentication.issuer,
            algorithm: config.authentication.algorithm
        }

        token = jwt.sign(payload, cert, options)

        AuthenticationClient.mockImplementation(() => {
            return {
                users: {
                    getInfo: () => Promise.resolve({nickname: 'test user'})
                }
            }
        })
    })

    let defaultCase

    afterEach(async () => {
        await models.attachment.destroy({
            where: {
                caseId: defaultCase.id
            }
        })

        await models.civilian.destroy({
            where: {
                caseId: defaultCase.id
            }
        })

        await models.audit_log.destroy({
            where: {
                caseId: defaultCase.id
            }
        })

        await models.cases.destroy({
            where: {
                id: defaultCase.id
            }
        })
    })

    describe('POST /cases/:id/attachments', () => {


        test('should return updated case after adding attachment', async () => {
            let civilian = new Civilian.Builder().defaultCivilian().withId(undefined).build()
            defaultCase = new Case.Builder().defaultCase().withId(undefined).withCivilians([civilian]).build()
            defaultCase = await models.cases.create(defaultCase, {include: [{model: models.civilian}]})
            let mockKey = `${defaultCase.id}/mock_filename`

            AWS.S3.mockImplementation(() => {
                return {
                    upload: (params, options) => ({
                        promise: () => Promise.resolve({Key: mockKey})
                    }),
                    config: {
                        loadFromPath: jest.fn()
                    }
                }
            })

            await request(app)
                .post(`/cases/${defaultCase.id}/attachments`)
                .set('Authorization', `Bearer ${token}`)
                .set('Content-Type', 'multipart/form-data')
                .field('description', 'this is a description')
                .attach('avatar', __dirname + '/../../README.md')
                .expect(200)
                .then(response => {
                    expect(response.body.id).toEqual(defaultCase.id)
                    expect(response.body.civilians[0].id).toEqual(defaultCase.civilians[0].id)
                    expect(response.body.attachments[0].fileName).toEqual('README.md')
                    expect(response.body.status).toEqual('Active')
                })
        })

        test('should return 409 when file is a duplicate', async () => {
            let civilian = new Civilian.Builder().defaultCivilian().withId(undefined).build()
            let attachment = new Attachment.Builder().defaultAttachment()
                .withId(undefined)
                .withCaseId(undefined)
            defaultCase = new Case.Builder().defaultCase()
                .withId(undefined)
                .withCivilians([civilian])
                .withAttachments([attachment])
                .build()
            defaultCase = await models.cases.create(defaultCase, {include: [{model: models.civilian}, {model: models.attachment}]})

            let mockFileName = 'test_file.pdf'

            AWS.S3.mockImplementation(() => {
                return {
                    upload: (params, options) => ({
                        promise: () => Promise.resolve({Key: mockFileName})
                    }),
                    config: {
                        loadFromPath: jest.fn()
                    }
                }
            })

            await request(app)
                .post(`/cases/${defaultCase.id}/attachments`)
                .set('Authorization', `Bearer ${token}`)
                .set('Content-Type', 'multipart/form-data')
                .attach(mockFileName, __dirname + '/testFixtures/test_file.pdf')
                .expect(409)
        })
    })

    describe('DELETE /cases/:id/attachments/:fileName', () => {
        test('should delete attachment from case', async () => {
            let civilian = new Civilian.Builder().defaultCivilian().withId(undefined).build()
            let attachmentToKeep = new Attachment.Builder().defaultAttachment()
                .withId(undefined)
                .withCaseId(undefined)

            let attachmentToDelete = new Attachment.Builder().defaultAttachment()
                .withId(undefined)
                .withCaseId(undefined)
                .withFileName('test_file_two.pdf')

            defaultCase = new Case.Builder().defaultCase()
                .withId(undefined)
                .withCivilians([civilian])
                .withAttachments([attachmentToKeep, attachmentToDelete])
                .build()

            let caseWithSameFilename = new Case.Builder().defaultCase()
                .withId(undefined)
                .withCivilians([civilian])
                .withAttachments([attachmentToKeep, attachmentToDelete])
                .build()

            defaultCase = await models.cases.create(defaultCase, {include: [{model: models.civilian}, {model: models.attachment}]})
            caseWithSameFilename = await models.cases.create(caseWithSameFilename, {include: [{model: models.civilian}, {model: models.attachment}]})

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

            await request(app)
                .delete(`/cases/${defaultCase.id}/attachments/${attachmentToDelete.fileName}`)
                .set('Authorization', `Bearer ${token}`)
                .set('Content-Type', 'multipart/form-data')
                .expect(200)
                .then(response => {
                    expect(response.body.attachments.length).toEqual(1)
                    expect(response.body.attachments[0].fileName).toEqual(attachmentToKeep.fileName)
                })

            const attachmentsFromUnmodifiedCase = await models.attachment.findAll({
                where: {
                    caseId: caseWithSameFilename.id
                }
            })

            expect(attachmentsFromUnmodifiedCase.length).toEqual(2)

        })
    })
});
