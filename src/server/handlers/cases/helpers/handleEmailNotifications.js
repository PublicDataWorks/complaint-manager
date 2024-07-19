// import * as FormData from "form-data";
// import Mailgun from "mailgun.js";
const formData = require("form-data");
const Mailgun = require("mailgun.js");
const handleEmailNotifications = async (
  mentionedUser,
  caseId,
  mentionedUserEmail,
  casenoteLink
) => {
  try {
    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({
      username: "api",
      key: process.env.MAILGUN_API_KEY || ""
    });
    // const listOfEmails = [];
    // const listOfUsers = [];
    // for (const user of users) {
    //   listOfEmails.push(user.value);
    //   listOfUsers.push(user.label);
    // }
    console.log("mentionedUser", mentionedUser);
    console.log("mentionedUserEmail", mentionedUserEmail);
    const msg = await mg.messages.create("", {
      //add domain email here
      from: `Complaint Manager <>`,
      to: [mentionedUserEmail],
      subject: "Hello",
      text: `Hello Complaint manager user: ${mentionedUser}, current user has tagged you in a case note for case # ${caseId} and requests your review. Please click on the following link to view this case: ${casenoteLink}`
    });

    console.log(msg);
    // logs response data
  } catch (error) {
    console.log("ERRRRRRRORR", error);
  }
};
export default handleEmailNotifications;
