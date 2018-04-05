import app from './server'
import request from 'supertest'
import moment from "moment"
import fs from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'
import ms from 'smtp-tester'
import Sequelize from 'sequelize'
import models from './models'
import {AuthenticationClient} from 'auth0'
import Civilian from "../client/testUtilities/civilian";
import Case from "../client/testUtilities/case";
import Attachment from "../client/testUtilities/attachment";
import {civilianWithAddress, civilianWithoutAddress} from "../client/testUtilities/ObjectMothers";
import Address from "../client/testUtilities/Address";
import {EXPORT_AUDIT_LOG} from "../sharedUtilities/constants";

const config = require('./config/config')[process.env.NODE_ENV]

jest.mock('auth0', () => ({
    AuthenticationClient: jest.fn()
}))

jest.mock('aws-sdk', () => ({
        S3: jest.fn()
    })
)

const Op = Sequelize.Op

function buildTokenWithPermissions(permissions) {
    var privateKeyPath = path.join(__dirname, 'config', 'test', 'private.pem')
    var cert = fs.readFileSync(privateKeyPath)

    var payload = {
        foo: 'bar',
        scope: `${config.authentication.scope} ${permissions}`

    }

    var options = {
        audience: config.authentication.audience,
        issuer: config.authentication.issuer,
        algorithm: config.authentication.algorithm,
    }

    return jwt.sign(payload, cert, options);
}

describe('server', () => {
    let token

    beforeEach(async () => {
        token = buildTokenWithPermissions();

        AuthenticationClient.mockImplementation(() => {
            return {
                users: {
                    getInfo: () => Promise.resolve({nickname: 'test user'})
                }
            }
        })
    })

    describe('GET /health-check', () => {
        test('should show healthy if db connection works', async () => {
            await request(app)
                .get('/health-check')
                .expect(200)
        })
    })

    describe('token check', () => {
        test('should return 401 with invalid token', async () => {
            await request(app)
                .get('/api/cases')
                .set('Content-Header', 'application/json')
                .set('Authorization', `Bearer INVALID_KEY`)
                .expect(401)
                .then(response => {
                    expect(response.body).toEqual({error: 'invalid token...'})
                })
        })

        test('should return 401 without authorization header', async () => {
            await request(app)
                .get('/api/cases')
                .set('Content-Header', 'application/json')
                .expect(401)
                .then(response => {
                    expect(response.body).toEqual({error: 'invalid token...'})
                })
        })
    })

    describe('POST /audit', () => {
        const mockLog = 'Test Output';
        test('should audit log out', async () => {
            await request(app)
                .post('/api/audit')
                .set('Content-Header', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send({log: mockLog})
                .expect(201);

            const log = await models.audit_log.findAll({
                where: {
                    action: mockLog
                }
            });

            expect(log.length).toEqual(1)
        });

        afterEach( async()=>{
            await models.audit_log.destroy({
                where:{
                    action: mockLog
                }
            })
        })
    });

    describe('POST and PUT /cases', () => {
        let requestBody, responseBody

        beforeEach(() => {
            //TODO Restructure this to have the same structure as represented in Redux/Builder.
            requestBody = {
                civilian: {
                    firstName: 'Manny',
                    lastName: 'Rodriguez',
                    phoneNumber: "8201387432",
                    email: 'mrod@gmail.com',
                },
                case: {
                    firstContactDate: "2018-01-31",
                    incidentDate: "2018-03-16T16:59",
                    complainantType: 'Civilian',
                    createdBy: 'tuser',
                    assignedTo: 'tuser'
                }
            }
        })

        afterEach(() => {
            models.civilian.destroy({
                where: {
                    id: responseBody.civilians[0].id
                }
            })

            models.audit_log.destroy({
                where: {
                    caseId: responseBody.id
                }
            })

            models.cases.destroy({
                where: {
                    id: responseBody.id
                }
            })
        })

        test('should create and edit a case', async () => {
            let createdCaseId;
            const caseRequest = request(app)

            await caseRequest
                .post('/api/cases')
                .set('Content-Header', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(requestBody)
                .expect(201)
                .then(response => {
                    responseBody = response.body
                    createdCaseId = response.body.id

                    expect(response.body).toEqual(
                        expect.objectContaining(
                            {
                                ...requestBody.case,
                                civilians: expect.arrayContaining([
                                    expect.objectContaining(requestBody.civilian)
                                ])
                            }
                        )
                    )
                })

            const editBody = {
                firstContactDate: "2018-04-27",
                incidentTime: "16:00:00",
                incidentDateNew: "2018-03-18",
            }

            await caseRequest
                .put(`/api/cases/${createdCaseId}`)
                .set('Content-Header', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(editBody)
                .expect(200)
                .then(response => {
                    expect(response.body.firstContactDate).toEqual("2018-04-27");
                    expect(response.body.incidentTime).toEqual("16:00:00");
                    expect(response.body.incidentDateNew).toEqual("2018-03-18");

                    expect(response.body).toEqual(
                        expect.objectContaining(
                            {
                                id: createdCaseId,
                                ...editBody,
                                civilians: expect.arrayContaining([
                                    expect.objectContaining(requestBody.civilian)
                                ])
                            }
                        )
                    )
                })
        })

        test('should return 500 when cannot fetch user profile', async () => {
            AuthenticationClient.mockImplementation(() => {
                return {
                    users: {
                        getInfo: () => Promise.resolve('Unauthorized')
                    }
                }
            })

            await request(app)
                .post('/api/cases')
                .set('Content-Header', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(requestBody)
                .expect(500)
                .then(response => {
                    expect(response.body).toEqual({error: 'Could not retrieve user profile'})
                })
        })
    })


    describe('GET /cases', () => {
        let seededCase

        beforeEach(async () => {
            let civilian = new Civilian.Builder().defaultCivilian()
                .withId(undefined)
                .withFirstName('Robert')
                .build()


            let defaultCase = new Case.Builder().defaultCase()
                .withId(undefined)
                .withCivilians([civilian])
                .withAttachments(undefined)
                .build()

            seededCase = await models.cases.create(defaultCase, {include: [{model: models.civilian}]})
        })

        test('should get all cases', async () => {
            await request(app)
                .get('/api/cases')
                .set('Content-Header', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .expect(200)
                .then(response => {
                    expect(response.body.cases).toEqual(
                        expect.arrayContaining([
                            expect.objectContaining({
                                civilians: expect.arrayContaining([
                                    expect.objectContaining({
                                        firstName: seededCase.civilians[0].firstName,
                                        lastName: seededCase.civilians[0].lastName,
                                        phoneNumber: seededCase.civilians[0].phoneNumber,
                                        email: seededCase.civilians[0].email,
                                    })
                                ]),
                                complainantType: seededCase.complainantType,
                                createdAt: seededCase.createdAt.toISOString(),
                                firstContactDate: moment(seededCase.firstContactDate).format("YYYY-MM-DD"),
                                status: 'Initial',
                                createdBy: 'tuser',
                                assignedTo: 'tuser'
                            })
                        ])
                    )
                })
        })

        afterEach(async () => {
            await models.civilian.destroy({
                where: {
                    caseId: seededCase.id
                }
            })

            await models.cases.destroy({
                where: {
                    id: seededCase.id
                }
            })
        })

    })

    describe('POST /civilian', () => {
        let existingCase, existingCivilian

        beforeEach(async () => {
            const existingCivilianAddress = new Address.Builder()
                .defaultAddress()
                .withId(undefined)
                .withCity("post city")
                .withCivilianId(undefined)

            const existingCivilianToCreate = new Civilian.Builder()
                .defaultCivilian()
                .withAddress(existingCivilianAddress)
                .withId(undefined)
                .withCaseId(undefined)
                .withFirstName('Existing Civilian')
                .build()

            const caseToCreate = new Case.Builder()
                .defaultCase()
                .withId(undefined)
                .withCivilians([existingCivilianToCreate])

            existingCase = await models.cases.create(caseToCreate, {
                include: [{
                    model: models.civilian,
                    include: [{
                        model: models.address
                    }]
                }]
            })
            existingCivilian = existingCase.civilians[0]
        })

        afterEach(async () => {
            await models.address.destroy({where: {city: 'post city'}})
            await models.audit_log.destroy({where: {caseId: existingCase.id}})
            await models.civilian.destroy({where: {caseId: existingCase.id}})
            await models.cases.destroy({where: {id: existingCase.id}})
        })

        test('should create a civilian and add it to a case', async () => {
            const newCivilianAddress = new Address.Builder()
                .defaultAddress()
                .withId(undefined)
                .withCity("post city")
                .withCivilianId(undefined)

            const newCivilian = new Civilian.Builder()
                .defaultCivilian()
                .withAddress(newCivilianAddress)
                .withId(undefined)
                .withCaseId(existingCase.id)
                .withFirstName('New Civilian')
                .build()

            await request(app)
                .post(`/api/civilian`)
                .set('Content-Header', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(newCivilian)
                .expect(201)
                .then(response => {
                    const civilians = response.body

                    expect(civilians).toEqual(expect.arrayContaining(
                        [expect.objectContaining({
                            firstName: existingCivilian.firstName,
                            caseId: existingCase.id,
                            address: expect.objectContaining({
                                city: 'post city'
                            })
                        }),
                            expect.objectContaining({
                                firstName: newCivilian.firstName,
                                caseId: existingCase.id,
                                address: expect.objectContaining({
                                    city: 'post city'
                                })
                            })
                        ])
                    )
                })
        })
    })

    describe('PUT /civilian/:id', () => {
        let seededCivilian, seededCase
        beforeEach(async () => {
            const caseDefault = new Case.Builder().defaultCase().build();
            await models.address.destroy({where: {civilianId: caseDefault.civilians[0].id}})
            await models.audit_log.destroy({where: {caseId: caseDefault.id}})
            await models.civilian.destroy({where: {caseId: caseDefault.id}})
            await models.cases.destroy({where: {id: caseDefault.id}})

            seededCase = await models.cases.create(caseDefault, {include: [{model: models.civilian}]})
            seededCivilian = seededCase.civilians[0]
        });

        afterEach(async () => {
            await models.address.destroy({where: {civilianId: seededCivilian.id}})
            await models.civilian.destroy({where: {id: seededCivilian.id}})
            await models.audit_log.destroy({where: {caseId: seededCase.id}})
            await models.cases.destroy({where: {id: seededCase.id}})
        });

        test('should update an existing civilian', async () => {
            const updatedCivilian = {
                firstName: 'BOBBY',
                lastName: 'FISHHERRR',
            }
            await request(app)
                .put(`/api/civilian/${seededCivilian.id}`)
                .set('Content-Header', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(updatedCivilian)
                .expect(200)
                .then(response => {
                    const civilians = response.body

                    expect(civilians).toEqual(expect.arrayContaining(
                        [
                            expect.objectContaining({
                                firstName: updatedCivilian.firstName,
                                lastName: updatedCivilian.lastName
                            })
                        ])
                    )
                })
        })

        test('should save new address if it doesnt exist yet', async () => {
            const updatedCivilian = {
                address: {
                    state: 'IL'
                }
            }
            await request(app)
                .put(`/api/civilian/${seededCivilian.id}`)
                .set('Content-Header', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(updatedCivilian)
                .expect(200)
                .then(response => {
                    const civilians = response.body

                    expect(civilians).toEqual(expect.arrayContaining(
                        [
                            expect.objectContaining({
                                address: expect.objectContaining({
                                    state: updatedCivilian.address.state
                                })
                            })
                        ])
                    )
                })
        })
        test('should update address if it exists', async () => {

            await request(app)
                .put(`/api/civilian/${civilianWithAddress.id}`)
                .set('Content-Header', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(civilianWithAddress)

            civilianWithAddress.address.city = 'New Orleans'

            await request(app)
                .put(`/api/civilian/${civilianWithAddress.id}`)
                .set('Content-Header', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(civilianWithAddress)
                .expect(200)
                .then(response => {
                    const civilians = response.body

                    expect(civilians).toEqual(expect.arrayContaining(
                        [
                            expect.objectContaining({
                                address: expect.objectContaining({
                                    city: 'New Orleans'
                                })
                            })
                        ])
                    )
                })

        })
        test('should allow blank address', async () => {
            await request(app)
                .put(`/api/civilian/${civilianWithAddress.id}`)
                .set('Content-Header', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(civilianWithAddress)

            await request(app)
                .put(`/api/civilian/${civilianWithoutAddress.id}`)
                .set('Content-Header', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(civilianWithoutAddress)
                .then(response => {
                    const civilians = response.body

                    expect(civilians).toEqual(expect.arrayContaining(
                        [
                            expect.objectContaining({
                                address: expect.objectContaining({
                                    streetAddress: "",
                                    streetAddress2: "",
                                    city: "",
                                    state: "",
                                    country: "",
                                    zipCode: ""
                                })
                            })
                        ])
                    )
                })

        })

        test('should update the case status to active when an associated civilian has been updated ', async () => {
            const updatedCivilian = {
                firstName: 'BOBBY'
            }
            await request(app)
                .put(`/api/civilian/${seededCivilian.id}`)
                .set('Content-Header', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(updatedCivilian)
                .expect(200)

            await request(app)
                .get(`/api/cases/${seededCase.id}`)
                .set('Content-Header', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .expect(200)
                .then(response => {
                    expect(response.body.status).toEqual('Active')  //TODO Status should be an ENUM or at least a global constant
                })
        });
    })

    describe('POST /users', () => {
        let mailServer
        beforeEach(() => {
            mailServer = ms.init(2525)
        })
        afterEach(async () => {
            await models.users.destroy({
                where: {
                    firstName: 'Ron',
                    lastName: 'Swanson'
                }
            })
            mailServer.stop()
        })

        test('should create a user', async () => {

            mailServer.bind('rswanson@pawnee.gov', (destinationAddress, id, email) => {
                expect(destinationAddress).toEqual("rswanson@pawnee.gov")
            });

            await request(app)
                .post('/api/users')
                .set('Content-Header', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send({firstName: 'Ron', lastName: 'Swanson', email: 'rswanson@pawnee.gov'})
                .expect(201)
                .then(response => {
                    expect(response.body.id).not.toBeUndefined()
                    expect(response.body.firstName).toEqual('Ron')
                    expect(response.body.lastName).toEqual('Swanson')
                    expect(response.body.email).toEqual('rswanson@pawnee.gov')
                    expect(response.body.createdAt).not.toBeUndefined()
                    expect(response.body.password).toBeUndefined()
                })
        })
    })

    describe('GET /users', () => {
        let seededUsers

        beforeEach(async () => {
            seededUsers = await models.users.bulkCreate([{
                firstName: 'Carlman',
                lastName: 'Domen',
                email: 'cdomen@gmail.com',
                password: 'password123'
            }, {
                firstName: 'Ellery',
                lastName: 'Salome',
                email: 'esalome@gmail.com',
                password: 'password123'
            }], {
                returning: true
            })
        })

        afterEach(async () => {
            const seededIds = seededUsers.map(user => user.id)

            await models.users.destroy({
                where: {
                    id: {
                        [Op.in]: seededIds
                    }
                }
            })
        })

        test('should get all users', async () => {
            await request(app)
                .get('/api/users')
                .set('Content-Header', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .expect(200)
                .then(response => {
                    expect(response.body.users).toEqual(
                        expect.arrayContaining([
                            expect.objectContaining({
                                firstName: seededUsers[0].firstName,
                                lastName: seededUsers[0].lastName,
                                email: seededUsers[0].email,
                                createdAt: seededUsers[0].createdAt.toISOString()
                            }),
                            expect.objectContaining({
                                firstName: seededUsers[1].firstName,
                                lastName: seededUsers[1].lastName,
                                email: seededUsers[1].email,
                                createdAt: seededUsers[1].createdAt.toISOString()
                            })
                        ])
                    )
                })
        })
    })

    describe('GET /cases/:id', () => {
        let caseToRetrieve

        beforeEach(async () => {
            let attachment = new Attachment.Builder()
                .defaultAttachment()
                .withId(undefined)
                .withCaseId(undefined)
                .build()

            let civilian = new Civilian.Builder()
                .defaultCivilian()
                .withId(undefined)
                .withFirstName('Eleanor')
                .build()

            let caseToCreate = new Case.Builder()
                .defaultCase()
                .withId(undefined)
                .withCivilians([civilian])
                .withAttachments([attachment])
                .build()

            caseToRetrieve = await models.cases.create(caseToCreate, {
                returning: true,
                include: [
                    {model: models.civilian},
                    {model: models.attachment}]
            })
        })

        afterEach(async () => {
            await models.attachment.destroy({
                where: {
                    caseId: caseToRetrieve.id
                }
            })

            await models.civilian.destroy({
                where: {
                    id: caseToRetrieve.civilians[0].id
                }
            })
            await models.cases.destroy({
                where: {
                    id: caseToRetrieve.id
                }
            })
        })

        test('should get case', async () => {
            await request(app)
                .get(`/api/cases/${caseToRetrieve.id}`)
                .set('Content-Header', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .expect(200)
                .then(response => {
                    expect(response.body).toEqual(
                        expect.objectContaining({
                            id: caseToRetrieve.id,
                            complainantType: caseToRetrieve.complainantType,
                            status: caseToRetrieve.status,
                            civilians: expect.arrayContaining([
                                expect.objectContaining({
                                    firstName: caseToRetrieve.civilians[0].firstName,
                                    lastName: caseToRetrieve.civilians[0].lastName,
                                    email: caseToRetrieve.civilians[0].email
                                })
                            ]),
                            attachments: expect.arrayContaining([
                                expect.objectContaining({
                                    id: caseToRetrieve.attachments[0].id,
                                    caseId: caseToRetrieve.attachments[0].caseId,
                                    fileName: caseToRetrieve.attachments[0].fileName
                                })
                            ])
                        })
                    )
                })
        })
    });

    describe('PUT /cases/id/narrative', () => {
        let caseToUpdate

        beforeEach(async () => {
            let civilian = new Civilian.Builder()
                .defaultCivilian()
                .withId(undefined)
                .withFirstName('Eleanor')
                .build()

            let caseToCreate = new Case.Builder()
                .defaultCase()
                .withId(undefined)
                .withCivilians([civilian])
                .withNarrativeDetails('Beginning narrative')
                .build()

            caseToUpdate = await models.cases.create(caseToCreate
                , {
                    returning: true,
                    include: [{model: models.civilian}]
                })
        })

        afterEach(async () => {
            await models.civilian.destroy({
                where: {
                    id: caseToUpdate.civilians[0].id
                }
            })
            await models.audit_log.destroy({
                where: {
                    caseId: caseToUpdate.id
                }
            })
            await models.cases.destroy({
                where: {
                    id: caseToUpdate.id
                }
            })
        })

        test('should update case narrative', async () => {
            const updatedNarrative = {narrativeDetails: 'A very updated case narrative.'}

            await request(app)
                .put(`/api/cases/${caseToUpdate.id}/narrative`)
                .set('Content-Header', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(updatedNarrative)
                .expect(200)
                .then(response => {
                    expect(response.body.id).toEqual(caseToUpdate.id)
                    expect(response.body.civilians[0].firstName).toEqual(caseToUpdate.civilians[0].firstName)
                    expect(response.body.civilians[0].lastName).toEqual(caseToUpdate.civilians[0].lastName)
                    expect(response.body.civilians[0].email).toEqual(caseToUpdate.civilians[0].email)
                    expect(response.body.complainantType).toEqual(caseToUpdate.complainantType)
                    expect(response.body.narrativeDetails).toEqual(updatedNarrative.narrativeDetails)
                    expect(response.body.status).toEqual('Active')
                })
        })
    });

    describe('GET /api/export-audit-log', () => {
        let testCase;
        const testCreationDate = new Date("2018-01-31T19:00Z");
        beforeEach( async () => {
            testCase = await models.cases.create(new Case.Builder().defaultCase().withId(undefined).build())
            await models.audit_log.create({
                user: 'tuser',
                action: 'Test action entered',
                caseId: testCase.id,
                createdAt: testCreationDate
            })
        })

        afterEach( async () => {
            await models.cases.destroy({
                truncate: true,
                cascade: true
            })
        })

        test('should return audit log csv when user has token with export permissions', async () => {
            const tokenWithExportPermission = buildTokenWithPermissions(EXPORT_AUDIT_LOG)
            await request(app)
                .get('/api/export-audit-log')
                .set('Authorization', `Bearer ${tokenWithExportPermission}`)
                .expect(200)
                .then( response => {
                    expect(response.text).toContain(`Date,Case #,Event,User\n01/31/2018 13:00 CST,${testCase.id},Test action entered,tuser\n`)
                })
        })

        test('should return 401 when user has token without export permissions', async () => {
            await request(app)
                .get('/api/export-audit-log')
                .set('Authorization', `Bearer ${token}`)
                .expect(401)
        })
    });
})
