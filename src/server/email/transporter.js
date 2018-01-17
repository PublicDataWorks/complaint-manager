const nodemailer = require('nodemailer')

let transporter

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging' ) {
    transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com",
        port: 587,
        secureConnection: false,
        tls: {
            ciphers: 'SSLv3'
        },
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD
        }
    })
} else {
    transporter = nodemailer.createTransport({
        secureConnection: false,
        host: 'email',
        port: 587
    });
}

module.exports = transporter;



