const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');

const auth = {
    auth: {
        api_key: 'key-75f013781f63757598f54a96b64398a9-2fbe671d-f60903ae',
        domain: 'sandbox88ef036ecb064263b3fdaac595b964ee.mailgun.org'
    }

};
const transporter = nodemailer.createTransport(mailGun(auth));
// const sendMail = (email, subject, message) => {
const mailOptions = {
    from: 'example@gmail.com',
    to: 'mduduziavatar@gmail.com',
    subject: 'testing ',
    message: 'please just work aleardy'
};

transporter.sendMail(mailOptions, function(err, data) {
    if (err) {
        (err, null)
        console.log('error occurs');
    } else {
        (null, data)
        console.log('sent');
    }

});