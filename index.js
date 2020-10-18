const express = require("express");
const pg = require("pg");
const Pool = pg.Pool;
const connectionString = process.env.DATABASE_URL || 'postgresql://mdu:pg123@localhost:5432/nandi_collection';
const pool = new Pool({
    connectionString
});
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser"); // add this line
const app = express();
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false })); // add this line
app.use(bodyParser.json());
// const sendMail = require('./mail')
const nodemailer = require('nodemailer');

const mailGun = require('nodemailer-mailgun-transport');




//after you added this restart the app
app.get("/", function(req, res) {
    // const sales = await pool.query(`select id, name, price as cost, product as "product" from sales`)
    res.render("index");
});

app.get('/buy', function(req, res) {

    res.render("index");

});

app.post('/send', function(req, res) {
    const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>
    <li>Name: ${req.body.name}</li>
    <li>Email: ${req.body.email}</li>
    <li>Subject: ${req.body.subject}</li>
    <li>Message: ${req.body.message}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>

    `;

    let transporter = nodemailer.createTransport({

        auth: {
            api_key: '75f013781f63757598f54a96b64398a9-2fbe671d-f60903ae',
            domain: 'sandbox88ef036ecb064263b3fdaac595b964ee.mailgun.org'
        },
        tls: { rejectUnauthorized: false }

    });

    // send mail with defined transport object
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
                console.log('success');

            }

        });
    };
    res.render('contacts', { msg: 'Email has been sent' })
});

app.get('/contacts', function(req, res) {
    //sending messages

    res.render("contacts");
});

app.get("/sales", function(req, res) {
    res.render("sales");
});

const PORT = process.env.PORT || 4009;

app.listen(PORT, function() {
    console.log("App started on port :" + PORT);
});