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

    async function get(id) {
        let productResult = await pool.query('select * from sales where id = $1', [id]);
        let product = productResult.rows[0];
        return product;

    }

    async function update(product) {
        var data = [
            product.name,
            product.description,
            product.price,
            product.id
        ];

        let updateQuery = `UPDATE sales 
            SET name = $1, 
                product = $2, 
                price = $3 
            WHERE id = $4`;

        return pool.query(updateQuery, data);
    }

    async function deleteById(id) {
        return pool.query('delete from sales where id = $1', [id]);
    }
    return {
        all,
        add,
        filtered,
        deleteById,
        update,
        get
    }
};