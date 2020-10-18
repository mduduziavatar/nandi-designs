const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');

const auth = {
    auth: {
        api_key: '75f013781f63757598f54a96b64398a9-2fbe671d-f60903ae',
        domain: 'sandbox88ef036ecb064263b3fdaac595b964ee.mailgun.org'
    }

};
const transporter = nodemailer.createTransport(mailGun(auth));
const sendMail = (email, subject, text) => {
    const mailOptions = {
        from: email,
        to: 'mduduziavatar@gmail.com',
        subject,
        text
    };

    transporter.sendMail(mailOptions, function(err, data) {
        if (err) {
            (err, null)
            console.log('error occurs');
        } else {
            (null, data)
        }

    });
};
module.exports = sendMail;