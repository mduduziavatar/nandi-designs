module.exports = function nandisRoutes(nandiDesign) {

    async function index(req, res, next) {
        try {
            res.render('index');
        } catch (err) {
            next(err)

        }
    }

    async function filter(req, res, next) {
        const priceFilter = req.body.priceFilter;
        let filteredData = await nandiDesign.filtered(priceFilter)
        try {
            res.render("sales", {
                sales: filteredData
            });
        } catch (err) {
            next(err)

        }
    }
    async function update(req, res, next) {
        try {
            await nandiDesign.update({
                name: req.body.name,
                product: req.body.product,
                price: Number(req.body.price),
                id: req.params.id
            });
            res.redirect('/sales');
        } catch (err) {
            (err)
        }
    }

    async function sales(req, res, next) {
        try {
            const price = req.body.price && Number(req.body.price);
            const name = req.body.name;
            const product = req.body.product;
            if (price && name && product) {
                await nandiDesign.inserting({
                    price,
                    name,
                    product
                });
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
                const sales = await nandiDesign.all()
                res.render("sales", {
                    priceInvalid,
                    customersNameInvalid,
                    sales: sales,
                    productInvalid
                });
            }
        } catch (err) {
            (err)
        }
    }

    async function edit(req, res, next) {
        try {
            let id = req.params.id;
            let product = await nandiDesign.get(id);
            res.render('edit', {
                data: product
            });
        } catch (err) {
            (err)
        }
    }

    async function reset(req, res, next) {
        try {
            const id = req.params.id
            await nandiDesign.deleteById(id);
            const sales = await nandiDesign.all();
            res.render("sales", {
                sales: sales
            });
        } catch (err) {
            (err)
        }
    }

    async function all(req, res, next) {
        try {

            res.render("sales", {
                sales: await nandiDesign.all()
            })
        } catch (err) {
            (err)
        }
    }

    return {
        index,
        all,
        filter,
        update,
        sales,
        edit,
        reset
    }

}