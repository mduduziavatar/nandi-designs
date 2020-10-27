module.exports = function NandiDesign(pool) {
    async function all() {
        let data = await pool.query('select * from sales');
        return data.rows;
    }
    async function inserting(params) {
        await pool.query(`insert into sales(name, price, product) values ($1, $2, $3)`, [params.name, params.price, params.product]);
    }

    async function filtered(priceFilter) {
        let filteredData = []
        if (priceFilter === 'three') {
            const lessThen = await pool.query(`
                    select * from sales where price <= 300 `);
            return lessThen.rows
        } else
        if (priceFilter === 'more') {
            const moreThen = await pool.query(`
                    select * from sales where price > 300 `);
            return moreThen.rows
        } else {
            return all();
        }
    }

    async function get(id) {
        let productResult = await pool.query('select * from sales where id = $1', [id]);
        let product = productResult.rows[0];
        return product;
    }

    async function update(database) {
        var data = [
            database.name,
            database.product,
            database.price,
            database.id
        ];

        let updateQuery = `
                    UPDATE sales SET name = $1,
                    product = $2,
                    price = $3 WHERE id = $4 `;

        return pool.query(updateQuery, data);
    }

    async function deleteById(id) {
        return pool.query('delete from sales where id = $1', [id]);
    }
    return {
        all,
        deleteById,
        update,
        get,
        filtered,
        inserting
    }
};