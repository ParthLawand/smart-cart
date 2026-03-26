require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./src/models/Product");

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Mongo Connected for Seeding"))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

const seedProducts = async () => {
    try {
        await Product.deleteMany({});

        await Product.deleteMany({});

        await Product.insertMany([
            { product_id: "COCA_COLA_01", name: "Coca Cola", price: 40 },
            { product_id: "CADBURY_01", name: "Cadbury", price: 20 },
            { product_id: "BINGO_01", name: "Bingo Chips", price: 20 },
            { product_id: "MARIE_GOLD_01", name: "Marie Gold Biscuit", price: 20 },
            { product_id: "DOVE_01", name: "Dove Soap", price: 60 }
        ]);

        console.log("Products Seeded Successfully");
        process.exit();
    } catch (error) {
        console.error("Seeding Error:", error);
        process.exit(1);
    }
};

seedProducts();
