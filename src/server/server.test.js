import app from './server'
import request from 'supertest'
import moment from "moment"
import fs from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'
import ms from 'smtp-tester'
import Sequelize from 'sequelize'
import models from './models'

const config = require('./config/config')[process.env.NODE_ENV]


const Op = Sequelize.Op

describe('server', () => {
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
                .get('/cases')
                .set('Content-Header', 'application/json')
                .set('Authorization', `Bearer INVALID_KEY`)
                .expect(401)
                .then(response => {
                    expect(response.text).toEqual('invalid token...')
                })
        })

        test('should return 401 without authorization header', async () => {
            await request(app)
                .get('/cases')
                .set('Content-Header', 'application/json')
                .expect(401)
                .then(response => {
                    expect(response.text).toEqual('invalid token...')
                })
        })
    })

    describe('POST /cases', () => {
        const requestBody = {
            civilian: {
                firstName: 'Manny',
                lastName: 'Rodriguez',
                phoneNumber: "8201387432",
                email: 'mrod@gmail.com',
            },
            case: {
                firstContactDate: "2018-01-31",
                complainantType: 'Civilian',
                createdBy: 'tuser',
                assignedTo: 'tuser'
            }
        };

        test('should create a case', async () => {
            let responseBody

            await request(app)
                .post('/cases')
                .set('Content-Header', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(requestBody)
                .expect(201)
                .then(response => {
                    responseBody = response.body
                    expect(response.body.id).not.toBeUndefined()
                    expect(response.body.complainantType).toEqual(requestBody.case.complainantType)
                    expect(response.body.firstContactDate).toEqual(requestBody.case.firstContactDate)
                    expect(response.body.createdAt).not.toBeUndefined()
                    expect(response.body.status).toEqual('Initial')
                    expect(response.body.createdBy).toEqual('tuser')
                    expect(response.body.assignedTo).toEqual('tuser')

                    expect(response.body.civilians[0].firstName).toEqual(requestBody.civilian.firstName)
                    expect(response.body.civilians[0].lastName).toEqual(requestBody.civilian.lastName)
                    expect(response.body.civilians[0].phoneNumber).toEqual(requestBody.civilian.phoneNumber)
                    expect(response.body.civilians[0].email).toEqual(requestBody.civilian.email)
                })

            models.civilian.destroy({
                where: {
                    id: responseBody.civilians[0].id
                }
            })

            models.cases.destroy({
                where: {
                    id: responseBody.id
                }
            })
        })
    })

    describe('GET /cases', () => {
        let seededCase

        beforeEach(async () => {

            seededCase = await models.cases.create({
                    complainantType: 'Civilian',
                    firstContactDate: "2018-01-31",
                    createdBy: 'tuser',
                    assignedTo: 'tuser',
                    civilians: [{
                        firstName: 'Robert',
                        lastName: 'Pollard',
                        phoneNumber: "8201387432",
                        email: 'rpollard@gmail.com'
                    }]
                }, {
                    include: [{model: models.civilian}]
                }
            )
        })

        test('should get all cases', async () => {
            await request(app)
                .get('/cases')
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
                    id: seededCase.civilians[0].id
                }
            })

            await models.cases.destroy({
                where: {
                    id: seededCase.id
                }
            })
        })

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
                .post('/users')
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
                .get('/users')
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

    describe('PUT /cases/id/narrative', () => {
        let caseToUpdate

        beforeEach(async () => {
            caseToUpdate = await models.cases.create({
                civilians: [{
                    firstName: 'Eleanor',
                    lastName: 'Schellstrop',
                    phoneNumber: "8201387432",
                    email: 'eschell@gmail.com'
                }],
                complainantType: 'Civilian',
                narrative: 'Beginning narrative',
                status: 'Initial',
                createdBy: 'tuser',
                assignedTo: 'tuser'
            }, {
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
            await models.cases.destroy({
                where: {
                    id: caseToUpdate.id
                }
            })
        })

        test('should update case narrative', async () => {
            const updatedNarrative = {narrative: 'A very updated case narrative.'}

            await request(app)
                .put(`/cases/${caseToUpdate.id}/narrative`)
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
                    expect(response.body.narrative).toEqual(updatedNarrative.narrative)
                    expect(response.body.status).toEqual('Active')
                })
        })
    });
})
