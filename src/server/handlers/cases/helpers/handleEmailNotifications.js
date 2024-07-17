// import * as FormData from "form-data";
// import Mailgun from "mailgun.js";
const formData = require("form-data");
const Mailgun = require("mailgun.js");
const sendUserEmail = async (mentionedUser, caseId, mentionedUserEmail) => {
  try {
    // const { users, caseId, currentUserEmail, location } = req.body;
    const caseNoteLink = window.location.href;
    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({
      username: "api",
      key: process.env.MAILGUN_API_KEY || ""
    });
    console.log("Api key", process.env.MAILGUN_API_KEY);
    // const listOfEmails = [];
    // const listOfUsers = [];
    // for (const user of users) {
    //   listOfEmails.push(user.value);
    //   listOfUsers.push(user.label);
    // }
    const msg = await mg.messages.create("sandbox-123.mailgun.org", {
      from: `Complaint Manager <julio.espinola1@thoughtworks.com>`,
      to: mentionedUserEmail,
      subject: "Hello",
      text: `Hello Complaint manager user: ${mentionedUser}, current user has tagged you in a case note for case # ${caseId} and requests your review. Please click on the following link to view this case: ${caseNoteLink}`
    });

    console.log(msg);
    // logs response data
  } catch (error) {
    console.log("ERRRRRRRORR", error);
  }
};
export default sendUserEmail;
