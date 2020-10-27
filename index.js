const express = require("express");
const NandiDesign = require('./nandi');
const Routes = require('./routes');
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
const routes = Routes(nandiDesign)
    //after you added this restart the app
app.get("/", routes.index);
app.get("/sales", routes.all);
app.post('/filter', routes.filter);
app.post('/products/update/:id', routes.update);
app.post("/sales", routes.sales);
app.get('/edit/:id', routes.edit);
app.get('/reset/:id', routes.reset);

const PORT = process.env.PORT || 4007;
app.listen(PORT, function() {
    console.log("App started on port :" + PORT);
});