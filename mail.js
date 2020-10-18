const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');

const auth = {
    auth: {
        api_key: '',
        domain: ''
    }

};
const transporter = nodemailer.createTransport(mailGun(auth));

const mailOptions = {
    from: 'siphiweavatar@gmail.com',
    to: 'mduduziavatar@gmail.com',
    subject: 'Test',
    text: 'Please work'
};
transporter.sendMail(mailOptions, function(err, data) {
    if (err) {
        console.log('error occurs');
    } else { message sent! }
});