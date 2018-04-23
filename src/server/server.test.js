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
import Officer from "../client/testUtilities/Officer";
import AWS from "aws-sdk";

const config = require('./config/config')[process.env.NODE_ENV]

jest.mock('auth0', () => ({
    AuthenticationClient: jest.fn()
}))

jest.mock('aws-sdk', () => ({
        S3: jest.fn()
    })
)

const Op = Sequelize.Op

function buildTokenWithPermissions(permissions, nickname) {
    const privateKeyPath = path.join(__dirname, 'config', 'test', 'private.pem')
    const cert = fs.readFileSync(privateKeyPath)

    const payload = {
        foo: 'bar',
        scope: `${config.authentication.scope} ${permissions}`
    };
    payload[`${config.authentication.nicknameKey}`] = nickname;

    const options = {
        audience: config.authentication.audience,
        issuer: config.authentication.issuer,
        algorithm: config.authentication.algorithm,
    }

    return jwt.sign(payload, cert, options);
}

describe('server', () => {
    let token

    beforeEach(async () => {
        token = buildTokenWithPermissions('', 'some_nickname');
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
                    expect(response.body).toEqual({error: 'Invalid token'})
                })
        })

        test('should return 401 without authorization header', async () => {
            await request(app)
                .get('/api/cases')
                .set('Content-Header', 'application/json')
                .expect(401)
                .then(response => {
                    expect(response.body).toEqual({error: 'Invalid token'})
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

        afterEach(async () => {
            await models.audit_log.destroy({
                where: {
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
                    incidentDate: "2018-03-16",
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

            models.address.destroy({
                where: {
                    id: responseBody.incidentLocationId
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
                incidentDate: "2018-03-18",
                incidentLocation: new Address.Builder().defaultAddress().withId(undefined).withStreetAddress('123 fleet street').build()
            }

            await caseRequest
                .put(`/api/cases/${createdCaseId}`)
                .set('Content-Header', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(editBody)
                .expect(200)
                .then(response => {
                    expect(response.body).toEqual(
                        expect.objectContaining(
                            {
                                id: createdCaseId,
                                ...editBody,
                                incidentLocation: expect.objectContaining({
                                    streetAddress: '123 fleet street'
                                }),
                                civilians: expect.arrayContaining([
                                    expect.objectContaining(requestBody.civilian)
                                ])
                            }
                        )
                    )
                })
        })

        test('should return 500 when nickname missing', async () => {
            token = buildTokenWithPermissions();

            await request(app)
                .post('/api/cases')
                .set('Content-Header', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(requestBody)
                .expect(500)
                .then(response => {
                    expect(response.body).toEqual({error: 'User nickname missing'})
                })
        })
    })


    describe('GET /cases', () => {
        let seededCase

        beforeEach(async () => {
            let civilian = new Civilian.Builder().defaultCivilian()
                .withId(undefined)
                .withNoAddress()
                .withFirstName('Robert')
                .build()


            let defaultCase = new Case.Builder().defaultCase()
                .withId(undefined)
                .withCivilians([civilian])
                .withAttachments(undefined)
                .withIncidentLocation(undefined)
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
                .withIncidentLocation(undefined)
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
            await models.audit_log.destroy({where: {caseId: existingCase.id}})
            await models.civilian.destroy({where: {caseId: existingCase.id}})
            await models.cases.destroy({where: {id: existingCase.id}})
            await models.address.destroy({where: {city: 'post city'}})
        })

        test('should create a civilian and add it to a case', async () => {
            const newCivilianAddress = new Address.Builder()
                .defaultAddress()
                .withId(undefined)
                .withCity("post city")

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
            const caseDefault = new Case.Builder().defaultCase().withIncidentLocation(undefined).build();
            await models.address.destroy({where: {id: caseDefault.civilians[0].addressId}})
            await models.audit_log.destroy({where: {caseId: caseDefault.id}})
            await models.civilian.destroy({where: {caseId: caseDefault.id}})
            await models.cases.destroy({where: {id: caseDefault.id}})

            seededCase = await models.cases.create(caseDefault, {
                include: [{
                    model: models.civilian,
                    include: [{model: models.address}]
                },]
            })
            seededCivilian = seededCase.civilians[0]
        });

        afterEach(async () => {
            await models.civilian.destroy({where: {id: seededCivilian.id}})
            await models.audit_log.destroy({where: {caseId: seededCase.id}})
            await models.cases.destroy({where: {id: seededCase.id}})
            await models.address.destroy({where: {id: seededCivilian.addressId}})
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
        let caseToRetrieve, incidentLocation, expectedStreetAddress

        beforeEach(async () => {
            let attachment = new Attachment.Builder()
                .defaultAttachment()
                .withId(undefined)
                .withCaseId(undefined)
                .build()

            let civilian = new Civilian.Builder()
                .defaultCivilian()
                .withNoAddress()
                .withId(undefined)
                .withFirstName('Eleanor')
                .build()

            let officer = new Officer.Builder().defaultOfficer().build()

            expectedStreetAddress = '1234 flower ave'
            incidentLocation = new Address.Builder().defaultAddress().withStreetAddress(expectedStreetAddress).withId(undefined).build()
            let caseToCreate = new Case.Builder()
                .defaultCase()
                .withId(undefined)
                .withCivilians([civilian])
                .withAttachments([attachment])
                .withIncidentLocation(incidentLocation)
                .withOfficers([officer])
                .build()


            caseToRetrieve = await models.cases.create(caseToCreate, {
                returning: true,
                include: [
                    {
                        model: models.civilian
                    },
                    {
                        model: models.attachment
                    },
                    {
                        model: models.address,
                        as: 'incidentLocation'
                    },
                    {
                        model: models.officer
                    }
                ]
            })
        })

        afterEach(async () => {
            await models.case_officer.destroy({
                where: {
                    case_id: caseToRetrieve.id
                }
            })

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

            await models.officer.destroy({
                where: {
                    id: caseToRetrieve.officers[0].id
                }
            })

            await models.address.destroy({
                where: {
                    id: caseToRetrieve.incidentLocationId
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
                            ]),
                            incidentLocation: expect.objectContaining({
                                streetAddress: expectedStreetAddress,
                                id: caseToRetrieve.incidentLocationId
                            }),
                            officers: expect.arrayContaining([
                                expect.objectContaining({
                                    id: caseToRetrieve.officers[0].id

                                })

                            ])
                        })
                    )
                })
        })
    });

    describe('GET /cases/:id/recent-activity', () => {
        let createdCase
        beforeEach(async() => {
            const existingCase = new Case.Builder().defaultCase().withIncidentLocation(undefined).build()
            createdCase = await models.cases.create(existingCase)

            await models.audit_log.create({
                caseId: createdCase.id,
                action: 'Case created',
                user: 'tuser'
            })
        });

        afterEach(async() => {
            await models.cases.truncate({
                cascade: true
            })
        });

        test('should display recent activity for an existing case', async () => {

            await request(app)
                .get(`/api/cases/${createdCase.dataValues.id}/recent-activity`)
                .set('Content-Header', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .expect(200)
                .then( response => {
                    expect(response.body).toEqual(
                        expect.arrayContaining([
                            expect.objectContaining({
                                caseId: createdCase.id,
                                action: 'Case created',
                                user: 'tuser'
                            })
                        ])
                    )

                    expect(response.body[0].createdAt).toBeDefined()
                })
        })
    });

    describe('PUT /cases/id/narrative', () => {
        let caseToUpdate

        beforeEach(async () => {
            let civilian = new Civilian.Builder()
                .defaultCivilian()
                .withId(undefined)
                .withNoAddress()
                .withFirstName('Eleanor')
                .build()

            let caseToCreate = new Case.Builder()
                .defaultCase()
                .withId(undefined)
                .withCivilians([civilian])
                .withNarrativeDetails('Beginning narrative')
                .withIncidentLocation(undefined)
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
            await models.address.destroy({
                truncate: true,
                cascade: true
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

    describe("GET /cases/:id/officers/search", () => {

        describe("match single attribute", () => {

            let bobOfficer, seededOfficers;

            beforeEach(async () => {
                bobOfficer = new Officer.Builder()
                    .defaultOfficer()
                    .withFirstName("Bob")
                    .withLastName("Ferguson")
                    .build();

                const garretOfficer = new Officer.Builder()
                    .defaultOfficer()
                    .withFirstName("Garret")
                    .withLastName("Fisher")
                    .withDistrict("First District")
                    .build();

                const grantOfficer = new Officer.Builder()
                    .defaultOfficer()
                    .withFirstName("Grant")
                    .withLastName("Livingston")
                    .withDistrict("Eighth District")
                    .build();

                seededOfficers = await models.officer.bulkCreate(
                    [bobOfficer, garretOfficer, grantOfficer],
                    {
                        returning: true
                    });
            });

            afterEach(async () => {
                const seededOfficerIds = seededOfficers.map(officer => officer.id);

                await models.officer.destroy({
                    where: {
                        id: {[Op.in]: seededOfficerIds}
                    }
                });
            });

            test("returns officer that partially matches first name", async () => {
                await request(app)
                    .get("/api/cases/5/officers/search")
                    .set("Authorization", `Bearer ${token}`)
                    .query({firstName: "bo"})
                    .expect(200)
                    .then((response) => {
                        expect(response.body.length).toEqual(1);
                        expect(response.body[0].firstName).toEqual(bobOfficer.firstName);
                        expect(response.body[0].middleName).toEqual(bobOfficer.middleName);
                        expect(response.body[0].lastName).toEqual(bobOfficer.lastName);
                        expect(response.body[0].fullName).toEqual(`${bobOfficer.firstName} ${bobOfficer.middleName} ${bobOfficer.lastName}`);
                    });
            });

            test("returns officer that partially matches last name", async () => {
                await request(app)
                    .get("/api/cases/5/officers/search")
                    .set("Authorization", `Bearer ${token}`)
                    .query({lastName: "fi"})
                    .expect(200)
                    .then((response) => {
                        expect(response.body.length).toEqual(1);
                        expect(response.body[0].firstName).toEqual("Garret");
                        expect(response.body[0].lastName).toEqual("Fisher");
                    });
            });

            test("returns officer that matches district", async () => {
                await request(app)
                    .get("/api/cases/5/officers/search")
                    .set("Authorization", `Bearer ${token}`)
                    .query({district: "Eighth District"})
                    .expect(200)
                    .then((response) => {
                        expect(response.body.length).toEqual(1);
                        expect(response.body[0].firstName).toEqual("Grant");
                        expect(response.body[0].lastName).toEqual("Livingston");
                    });
            });

        });

        describe("match multiple attributes", () => {
            let seededOfficers;

            beforeEach(async () => {
                const garretOfficer = new Officer.Builder().defaultOfficer()
                    .withFirstName("Garret")
                    .withLastName("Fisher")
                    .withDistrict("1st District")
                    .build();

                const garyOfficer = new Officer.Builder().defaultOfficer()
                    .withFirstName("Gary")
                    .withLastName("Fibbleton")
                    .withDistrict("8th District")
                    .build();

                const gaaOfficer = new Officer.Builder().defaultOfficer()
                    .withFirstName("Gaaaa")
                    .withLastName("Fibbleton")
                    .withDistrict("8th District")
                    .build();

                seededOfficers = await models.officer.bulkCreate(
                    [garretOfficer, garyOfficer, gaaOfficer],
                    {
                        returning: true
                    });
            });

            afterEach(async () => {
                const seededOfficerIds = seededOfficers.map(officer => officer.id);

                await models.officer.destroy({
                    where: {
                        id: {[Op.in]: seededOfficerIds}
                    }
                });
            });

            test("returns officer that matches first name, last name, and district", async () => {
                await request(app)
                    .get("/api/cases/5/officers/search")
                    .set("Authorization", `Bearer ${token}`)
                    .query({firstName: "Gar", lastName: "fi", district: "1st District"})
                    .expect(200)
                    .then((response) => {
                        expect(response.body.length).toEqual(1);
                        expect(response.body[0].firstName).toEqual("Garret");
                        expect(response.body[0].lastName).toEqual("Fisher");
                    });
            });

            test("returns multiple officers that matches first name, last name, sorting by last name first name", async () => {
                await request(app)
                    .get("/api/cases/5/officers/search")
                    .set("Authorization", `Bearer ${token}`)
                    .query({firstName: "Ga", lastName: "fi"})
                    .expect(200)
                    .then((response) => {
                        expect(response.body.length).toEqual(3);
                        expect(response.body[0].firstName).toEqual("Gaaaa");
                        expect(response.body[0].lastName).toEqual("Fibbleton");
                        expect(response.body[1].firstName).toEqual("Gary");
                        expect(response.body[1].lastName).toEqual("Fibbleton");
                        expect(response.body[2].firstName).toEqual("Garret");
                        expect(response.body[2].lastName).toEqual("Fisher");
                    });
            });
        });
    });

    describe('PUT /cases/:caseId/officers/:officerId', () => {
        let caseToCreate, officerToCreate, seededCase, seededOfficer

        beforeEach(async () => {
            caseToCreate = new Case.Builder().defaultCase().withId(undefined).withIncidentLocation(undefined).build();
            officerToCreate = new Officer.Builder().defaultOfficer().build()
            seededOfficer = await models.officer.create(officerToCreate)
            seededCase = await models.cases.create(caseToCreate)
        })

        afterEach(async () => {
            await models.audit_log.destroy({
                where: {
                    case_id: seededCase.id
                }
            })

            await models.case_officer.destroy({
                where: {
                    case_id: seededCase.id
                }
            })

            await models.cases.destroy({
                where: {
                    id: seededCase.id
                }
            })

            await models.officer.destroy({
                where: {
                    id: seededOfficer.id
                }
            })
        })

        test('should add an officer to a case', async () => {
            await request(app)
                .put(`/api/cases/${seededCase.id}/officers/${seededOfficer.id}`)
                .set('Content-Header', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send({})
                .expect(200)
                .then(response => {
                    expect(response.body).toEqual(
                        expect.objectContaining({
                            officers: expect.arrayContaining([
                                expect.objectContaining({
                                    id: seededOfficer.id
                                })
                            ])
                        })
                    )
                })
            const auditLog = await models.audit_log.findAll({ where: { caseId: seededCase.id }})

            expect(auditLog.length).toEqual(1)
            expect(auditLog[0].dataValues.action).toEqual("Accused Officer Added")
        })
    })

    describe('GET /api/export-audit-log', () => {
        let testCase;
        const testCreationDate = new Date("2018-01-31T19:00:22Z");
        const testCreationDateTwo = new Date("2018-01-28T19:00:50Z");
        beforeEach(async () => {
            testCase = await models.cases.create(new Case.Builder().defaultCase().withIncidentLocation(undefined).withId(undefined).build())
            await models.audit_log.create({
                user: 'tuser',
                action: 'Test action entered',
                caseId: testCase.id,
                createdAt: testCreationDate
            })

            await models.audit_log.create({
                user: 'tuser',
                action: 'Test action entered',
                caseId: testCase.id,
                createdAt: testCreationDateTwo
            })
        })

        afterEach(async () => {
            await models.address.destroy({
                truncate: true,
                cascade: true
            })
        })

        test('should return audit log csv when user has token with export permissions', async () => {
            const tokenWithExportPermission = buildTokenWithPermissions(EXPORT_AUDIT_LOG, 'nickname');
            await request(app)
                .get('/api/export-audit-log')
                .set('Authorization', `Bearer ${tokenWithExportPermission}`)
                .expect(200)
                .then(response => {
                    expect(response.text).toEqual(expect.stringContaining(`Date,Case #,Event,User\n01/28/2018 13:00:50 CST,${testCase.id},Test action entered,tuser\n01/31/2018 13:00:22 CST,${testCase.id},Test action entered,tuser\n`))
                })
        })

        test('should return 401 when user has token without export permissions', async () => {
            await request(app)
                .get('/api/export-audit-log')
                .set('Authorization', `Bearer ${token}`)
                .expect(401)
        })
    });

    describe('attachment routes', () => {
        let defaultCase, defaultCivilian, defaultAttachment, attachmentToDelete

        beforeEach( async() => {
            defaultCivilian = new Civilian.Builder().defaultCivilian()
                .withId(undefined)
                .withNoAddress()
                .build()
            defaultAttachment = new Attachment.Builder().defaultAttachment()
                .withId(undefined)
                .withCaseId(undefined)
            attachmentToDelete = new Attachment.Builder().defaultAttachment()
                .withId(undefined)
                .withCaseId(undefined)
                .withFileName('test_file_two.pdf')

            defaultCase = new Case.Builder().defaultCase()
                .withId(undefined)
                .withCivilians([defaultCivilian])
                .withAttachments([defaultAttachment, attachmentToDelete])
                .withIncidentLocation(undefined)
                .build()
            defaultCase = await models.cases.create(defaultCase, {include: [{model: models.civilian}, {model: models.attachment}]})
        });

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
                    .post(`/api/cases/${defaultCase.id}/attachments`)
                    .set('Authorization', `Bearer ${token}`)
                    .set('Content-Type', 'multipart/form-data')
                    .field('description', 'this is a description')
                    .attach('avatar', __dirname + '/../../README.md')
                    .expect(200)
                    .then(response => {
                        expect(response.body.id).toEqual(defaultCase.id)
                        expect(response.body.civilians[0].id).toEqual(defaultCase.civilians[0].id)
                        expect(response.body.attachments).toEqual(
                            expect.arrayContaining([
                                expect.objectContaining(
                                    { fileName: "README.md" })
                            ])
                        )
                        expect(response.body.status).toEqual('Active')
                    })

                const log = await models.audit_log.findOne({
                    where: {
                        caseId: defaultCase.id
                    }
                })

                expect(log.dataValues.user).toEqual('some_nickname')
            })

            test('should return 409 when file is a duplicate', async () => {
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
                    .post(`/api/cases/${defaultCase.id}/attachments`)
                    .set('Authorization', `Bearer ${token}`)
                    .set('Content-Type', 'multipart/form-data')
                    .attach(mockFileName, __dirname + '/testFixtures/test_file.pdf')
                    .expect(409)
            })
        })

        describe('DELETE /cases/:id/attachments/:fileName', () => {
            let caseWithSameFilename

            test('should delete attachment from case', async () => {
                caseWithSameFilename = new Case.Builder().defaultCase()
                    .withId(undefined)
                    .withCivilians([defaultCivilian])
                    .withAttachments([defaultAttachment, attachmentToDelete])
                    .withIncidentLocation(undefined)
                    .build()

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
                    .delete(`/api/cases/${defaultCase.id}/attachments/${attachmentToDelete.fileName}`)
                    .set('Authorization', `Bearer ${token}`)
                    .set('Content-Type', 'multipart/form-data')
                    .expect(200)
                    .then(response => {
                        expect(response.body.attachments.length).toEqual(1)
                        expect(response.body.attachments[0].fileName).toEqual(defaultAttachment.fileName)
                    })

                const attachmentsFromUnmodifiedCase = await models.attachment.findAll({
                    where: {
                        caseId: caseWithSameFilename.id
                    }
                })

                expect(attachmentsFromUnmodifiedCase.length).toEqual(2)

            })

            afterEach(async () => {
                await models.attachment.destroy({
                    where: {
                        caseId: caseWithSameFilename.id
                    }
                })

                await models.civilian.destroy({
                    where: {
                        caseId: caseWithSameFilename.id
                    }
                })

                await models.audit_log.destroy({
                    where: {
                        caseId: caseWithSameFilename.id
                    }
                })

                await models.cases.destroy({
                    where: {
                        id: caseWithSameFilename.id
                    }
                })
            })
        })
    });
})
