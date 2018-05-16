const nodemailer = require("nodemailer");
let config = require(__dirname + "/../config/config.js")[process.env.NODE_ENV];

let transporter = nodemailer.createTransport(config.email);

module.exports = transporter;
