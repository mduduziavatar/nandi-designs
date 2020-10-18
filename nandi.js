module.exports = function NandiDesign(pool) {
    async function all() {
        let data = await pool.query('select * from sales');
        return data.rows;
    }
    async function add() {
        let results = await pool.query('insert into sales (name, price, product) values ($1, $2, $3)', ['Siphiwe', 500, 't-shirt'])
    }
    return {
        all,
        add
    }
};