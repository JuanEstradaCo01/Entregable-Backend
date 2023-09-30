const mongoose = require("mongoose")
const productsmodels = require("./dao/models/productsModels")

const MONGODB_CONNECT_LOCAL = `mongodb+srv://${config.DB_USER}:${config.DB_PASSWORD}@${config.DB_HOST}/${config.DB_NAME}?retryWrites=true&w=majority`

;(async () => {
    await mongoose.connect(MONGODB_CONNECT_LOCAL)

    const products = await productsmodels.paginate({ }, { limit: 8, page: 1 })

    console.log(products)
})()