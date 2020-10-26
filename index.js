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
app.use(express.json());

const nandiDesign = NandiDesign(pool);
const session = require('express-session');
const flash = require('express-flash');

const sendMail = require('./mail')

// for sending emails
const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');

//after you added this restart the app
app.get("/", async function(req, res) {
    res.render("index");
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

    res.render('products/edit/:id', {});
});

app.post('/email', function(req, res) {
    console.log('Data: ', req.body);
    const { subject, email, message } = req.body;
    sendMail(subject, email, message, function(err, data) {
        if (err) {
            res.status(500).json({
                message: 'Internal Error'
            });
        } else {
            res.json({ message: 'Email sent!!!!' })

        }

    })
});

app.post('/products/update/:id', async function(req, res) {
    await nandiDesign.update({
        name: req.body.name,
        product: req.body.product,
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
        res.render("sales", {
            priceInvalid,
            customersNameInvalid,
            sales: sales.rows,
            productInvalid
        });
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