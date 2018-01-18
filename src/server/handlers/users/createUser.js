const nodemailer = require("nodemailer");

const models = require('../../models/index');
const generatePassword = require('password-generator');
const transporter = require('../../email/transporter')
const config = require('../../config/config')[process.env.NODE_ENV]

const createUser = async (request, response, next) => {
    try {
        const userToCreate = {
            password: generatePassword(12),
            ...request.body
        };

        const createdUser = await models.users.create(userToCreate);
        const info = await transporter.sendMail(message(createdUser))
        getMailLogs(info);

        response
            .status(201)
            .send(createdUser)
    } catch (e) {
        next(e)
    }
}

const message = (createdUser) => (
    {
        to: createdUser.email,
        from: config.email.fromEmailAddress,
        subject: 'Your NOIPM Password',
        text: createdUser.password
    }
)

function getMailLogs(info) {
    console.log('------Nodemailer-----')
    console.log('Accepted: ', info.accepted)
    console.log('Rejected: ', info.rejected)
    console.log('Response: ', info.response)

    if (nodemailer.getTestMessageUrl(info)) {
        console.log('Preview URL: ' + nodemailer.getTestMessageUrl(info));
    }
}

module.exports = createUser