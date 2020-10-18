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
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false })); // add this line
app.use(bodyParser.json()); // add  this line
app.use(express.urlencoded({ extended: false })); // add this line
app.use(express.json());
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
const path = require('path');
const router = express.Router;

// router.get('/', function(req, res) {

//     res.sendFile(path.join(__dirname, 'views', 'contacts.html'));

// });


//after you added this restart the app
app.get("/", function(req, res) {
    // const sales = await pool.query(`select id, name, price as cost, product as "product" from sales`)
    res.render("index");
});

app.get('/buy', function(req, res) {
    let data = req.body.name
    console.log('data: ', req.body.name)
    res.render("index");

})

app.post('/contacts', function(req, res) {
    //sending messages
    let data = req.body
    console.log(data)
    res.render("contacts");
});

app.get("/sales", function(req, res) {
    res.render("sales");
});

const PORT = process.env.PORT || 4009;

app.listen(PORT, function() {
    console.log("App started on port :" + PORT);
});