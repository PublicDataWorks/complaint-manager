const nodemailer = require("nodemailer");
const asyncMiddleware = require("../asyncMiddleware");
const models = require("../../models/index");
const generatePassword = require("password-generator");
const transporter = require("../../email/transporter");
const config = require("../../config/config")[process.env.NODE_ENV];

const createUser = asyncMiddleware(async (request, response) => {
  const userToCreate = {
    password: generatePassword(12),
    ...request.body
  };

  const createdUser = await models.users.create(userToCreate);
  await transporter.sendMail(message(createdUser));

  response.status(201).send(createdUser);
});

const message = createdUser => ({
  to: createdUser.email,
  from: config.email.fromEmailAddress,
  subject: "You have been added to NOIPM Complaint Manager",
  text: `A new password has been generated for you. Login with the password below:

${createdUser.password}

Thanks,
NOIPM Team`
});

function getMailLogs(info) {
  console.log("------Nodemailer-----");
  console.log("Accepted: ", info.accepted);
  console.log("Rejected: ", info.rejected);
  console.log("Response: ", info.response);

  if (nodemailer.getTestMessageUrl(info)) {
    console.log("Preview URL: " + nodemailer.getTestMessageUrl(info));
  }
}

module.exports = createUser;
