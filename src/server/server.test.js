import app from './server'
import request from 'supertest'
import transporter from './email/transporter'

const Sequelize = require('sequelize')
const models = require('./models')

const Op = Sequelize.Op

jest.mock('./email/transporter', () => ({
    sendMail: jest.fn()
}))

describe('server', () => {
    describe('GET /health-check', () => {
        test('should show healthy if db connection works', async () => {
            await request(app)
                .get('/health-check')
                .expect(200)
        })
    })

    describe('POST /cases', () => {
        const requestBody = {
            firstName: 'Manny',
            lastName: 'Rodriguez',
            phoneNumber: "8201387432",
            email: 'mrod@gmail.com',
            complainantType: 'Civilian'
        };

        afterEach(async () => {
            await models.cases.destroy({
                where: {
                    firstName: requestBody.firstName,
                    lastName: requestBody.lastName
                }
            })
        })

        test('should create a case', async () => {
            await request(app)
                .post('/cases')
                .set('Content-Header', 'application/json')
                .send(requestBody)
                .expect(201)
                .then(response => {
                    expect(response.body.id).not.toBeUndefined()
                    expect(response.body.complainantType).toEqual(requestBody.complainantType)
                    expect(response.body.firstName).toEqual(requestBody.firstName)
                    expect(response.body.lastName).toEqual(requestBody.lastName)
                    expect(response.body.phoneNumber).toEqual(requestBody.phoneNumber)
                    expect(response.body.email).toEqual(requestBody.email)
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
                complainantType: 'Civilian'
            }, {
                firstName: 'Joseph',
                lastName: 'Joestar',
                phoneNumber: "9021012345",
                email: 'hermit_purple@gmail.com',
                complainantType: 'Police Officer'
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
                                phoneNumber: seededCases[0].phoneNumber,
                                email: seededCases[0].email,
                                complainantType: seededCases[0].complainantType,
                                createdAt: seededCases[0].createdAt.toISOString(),
                                status: 'Initial'
                            }),
                            expect.objectContaining({
                                firstName: seededCases[1].firstName,
                                lastName: seededCases[1].lastName,
                                phoneNumber: seededCases[1].phoneNumber,
                                email: seededCases[1].email,
                                complainantType: seededCases[1].complainantType,
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
            transporter.sendMail.mockImplementation(() => Promise.resolve({accepted: '', response: '', rejected: ''}))

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
