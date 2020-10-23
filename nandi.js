module.exports = function NandiDesign(pool) {
    async function all() {
        let data = await pool.query('select * from sales');
        return data.rows;
    }
    async function add() {
        let results = await pool.query('insert into sales (name, price, product) values ($1, $2, $3)', ['Siphiwe', 500, 't-shirt'])
    }

    async function filtered(priceFilter) {
        let filteredData = [];

        const allSales = await pool.query(`select * from sales`);
        filteredData = allSales.rows

        if (priceFilter === 'one') {
            const lessThen = await pool.query(`select * from sales where price <= 300`);
            filteredData = lessThen.rows
        } else if (priceFilter === 'three') {
            const moreThen = await pool.query(`select * from sales where price >= 300`);
            filteredData = moreThen.rows
        }

    }
    return {
        all,
        add,
        filtered
    }
};