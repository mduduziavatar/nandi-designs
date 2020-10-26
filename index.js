const express = require("express");
const NandiDesign = require('./nandi');
const env = require('dotenv').config();
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
const nandiDesign = NandiDesign(pool);
const session = require('express-session');
const flash = require('express-flash');

// const sendMail = require('./mail')

// for sending emails
const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');

//after you added this restart the app
app.get("/", async function(req, res) {
    //  const sales = await pool.query(`select id, name, price as price, product as "product" from sales`)
    res.render("index", {});

});


app.get("/sales", async function(req, res) {
    const sales = await pool.query(`select * from sales`)
    res.render("sales", {
        sales: sales.rows
    });

});
app.get('/filter', async function(req, res) {
    const priceFilter = req.query.priceFilter;
    let filteredData = [];

    if (priceFilter === 'one') {
        const lessThen = await pool.query(`select * from sales where price <= 300`);
        filteredData = lessThen.rows
    } else if (priceFilter === 'three') {
        const moreThen = await pool.query(`select * from sales where price >= 300`);
        filteredData = moreThen.rows
    } else {
        const allSales = await pool.query(`select * from sales`);
        filteredData = allSales.rows
    }
    res.render("sales", {
        sales: filteredData
    });

});

app.get('/products/edit/:id', function(req, res) {



    res.render('products/edit/:id', {

    });
});
// app.post('/products/update/:id', async function(req, res) {
//     const data = await {
//         name: req.body.name,
//         product: req.body.product,
//         price: Number(req.body.price),
//         id: req.params.id
//     };
//     req.flash('info', 'Product updated!')
//     res.redirect('/products');

// });


// app.post('/send', async function(req, res) {
//     const output = `
//     <p>You have a new contact request</p>
//     <h3>Contact Details</h3>
//     <ul>
//     <li>Name: ${req.body.name}</li>
//     <li>Email: ${req.body.email}</li>
//     <li>Subject: ${req.body.subject}</li>
//     <li>Message: ${req.body.message}</li>
//     </ul>
//     <h3>Message</h3>
//     <p>${req.body.message}</p>

//     `;
//     console.log(req.body)

//     async function main() {
//         // Generate test SMTP service account from ethereal.email
//         // Only needed if you don't have a real mail account for testing
//         let testAccount = await nodemailer.createTestAccount();

//         // create reusable transporter object using the default SMTP transport
//         let transporter = nodemailer.createTransport({
//             service: 'gmail', // true for 465, false for other ports
//             auth: {
//                 user: process.env.GMAIL_EMAIL, // generated ethereal user
//                 pass: process.env.PASS, // generated ethereal password
//             },
//         });

//         // send mail with defined transport object
//         let info = await transporter.sendMail({
//             from: req.body.email, // sender address
//             to: 'circlefinanceloans@gmail.com', // list of receivers
//             subject: req.body.subject, // Subject line
//             text: req.body.message, // plain text body
//             html: output
//         });

//         console.log("Message sent: %s", info.messageId);
//         // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

//         // Preview only available when sending through an Ethereal account
//         console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
//         // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
//     }

//     main().catch(console.error);
//     res.render('index')
// });


app.post('/products/update/:id', async function(req, res) {
    await nandiDesign.update({
        name: req.body.name,
        product: req.body.description,
        price: Number(req.body.price),
        id: req.params.id
    });

    res.redirect('/sales');
});


app.post("/sales", async function(req, res) {
    const price = req.body.price && Number(req.body.price);
    const name = req.body.name;
    const product = req.body.product;
    console.log(req.body)

    if (price && name && product) {
        const INSERT_QUERY = "insert into sales (name, price, product) values ($1, $2, $3)";
        await pool.query(INSERT_QUERY, [name, price, product]);
        res.redirect("sales");

    } else {

        function validate(value, result) {
            if (!value) {
                return result;
            }
            return {};
        }
        const priceInvalid = validate(price, {
            style: "is-invalid",
            message: "Enter a valid amount e.g 200"
        });

        const customersNameInvalid = validate(name, {
            style: "is-invalid",
            message: "Enter a valid name e.g Siphiwe"
        });

        const productInvalid = validate(product, {
            style: "is-invalid",
            message: "Please enter a valid product e.g Nike blue pants"
        });
        const sales = await pool.query(`select * from sales`)



    }
});

app.get('/edit/:id', async function(req, res) {
    let id = req.params.id;
    let product = await nandiDesign.get(id);
    res.render('edit', {
        data: product
    });
});

app.get('/reset/:id', async function(req, res) {
    const id = req.params.id
    console.log(id)
    await nandiDesign.deleteById(id);
    const sales = await pool.query(`select * from sales`)
    res.render("sales", {
        sales: sales.rows
    });
});

const PORT = process.env.PORT || 4007;

app.listen(PORT, function() {
    console.log("App started on port :" + PORT);
});