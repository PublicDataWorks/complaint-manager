const models = require('../index')

describe('users', () => {
    test('should remove password from JSON representation', () => {
        const user = models.users.build({
            firstName: "Ekua",
            lastName: "Bogumil",
            email: "ebogumil@gmail.com",
            password: "password123"
        })

        const jsonRepresentation = user.toJSON()

        expect(jsonRepresentation.password).toBeUndefined()
    })
})