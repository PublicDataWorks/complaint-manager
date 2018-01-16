import app from './server'
import request from 'supertest'

const Sequelize = require('sequelize')
const models = require('./models')

const Op = Sequelize.Op

describe('server', () => {
    describe('GET /health-check', () => {
        test('should show healthy if db connection works', async () => {
            await request(app)
                .get('/health-check')
                .expect(200)
        })
    })

    describe('POST /cases', () => {
        const caseDetails = {
            firstName: 'Manny',
            lastName: 'Rodriguez',
            phoneNumber: "8201387432",
            email: 'mrod@gmail.com',
            incidentType: 'Citizen Complaint'
        };

        afterEach(async () => {
            await models.cases.destroy({
                where: {
                    firstName: caseDetails.firstName,
                    lastName: caseDetails.lastName
                }
            })
        })

        test('should create a case', async () => {
            await request(app)
                .post('/cases')
                .set('Content-Header', 'application/json')
                .send(caseDetails)
                .expect(201)
                .then(response => {
                    expect(response.body.id).not.toBeUndefined()
                    expect(response.body.incidentType).toEqual(caseDetails.incidentType)
                    expect(response.body.firstName).toEqual(caseDetails.firstName)
                    expect(response.body.lastName).toEqual(caseDetails.lastName)
                    expect(response.body.phoneNumber).toEqual(caseDetails.phoneNumber)
                    expect(response.body.email).toEqual(caseDetails.email)
                    expect(response.body.status).toEqual('Initial')
                    expect(response.body.createdAt).not.toBeUndefined()
                })
        })
    })

    describe('GET /cases', () => {
        let seededCases

        beforeEach(async () => {
            seededCases = await models.cases.bulkCreate([{
                firstName: 'Robert',
                lastName: 'Pollard',
                phoneNumber: "8201387432",
                email: 'rpollard@gmail.com',
                incidentType: 'Citizen Complaint'
            }, {
                firstName: 'Joseph',
                lastName: 'Joestar',
                phoneNumber: "9021012345",
                email: 'hermit_purple@gmail.com',
                incidentType: 'Citizen Complaint'
            }], {
                returning: true
            })
        })

        afterEach(async () => {
            const seededIds = seededCases.map(oneCase => oneCase.id)

            await models.cases.destroy({
                where: {
                    id: {
                        [Op.in]: seededIds
                    }
                }
            })
        })

        test('should get all cases', async () => {
            await request(app)
                .get('/cases')
                .set('Content-Header', 'application/json')
                .expect(200)
                .then(response => {
                    expect(response.body.cases).toEqual(
                        expect.arrayContaining([
                            expect.objectContaining({
                                firstName: seededCases[0].firstName,
                                lastName: seededCases[0].lastName,
                                createdAt: seededCases[0].createdAt.toISOString(),
                                status: 'Initial'
                            }),
                            expect.objectContaining({
                                firstName: seededCases[1].firstName,
                                lastName: seededCases[1].lastName,
                                createdAt: seededCases[1].createdAt.toISOString(),
                                status: 'Initial'
                            })
                        ])
                    )
                })
        })
    })

    describe('POST /users', () => {
        afterEach(async () => {
            await models.users.destroy({
                where: {
                    firstName: 'Ron',
                    lastName: 'Swanson'
                }
            })
        })

        test('should create a user', async () => {
            await request(app)
                .post('/users')
                .set('Content-Header', 'application/json')
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
})
