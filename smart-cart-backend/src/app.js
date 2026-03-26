const express = require("express");
const cors = require("cors");
const cartRoutes = require("./routes/cartRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const scanRoutes = require("./routes/scanRoutes");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middlewares/errorMiddleware");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://smartcart:smartcartsdp@ac-z2itrxa-shard-00-00.hngmevb.mongodb.net:27017,ac-z2itrxa-shard-00-01.hngmevb.mongodb.net:27017,ac-z2itrxa-shard-00-02.hngmevb.mongodb.net:27017/?ssl=true&replicaSet=atlas-2ype16-shard-0&authSource=admin&appName=Cluster0")
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error(err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/scan", scanRoutes);
app.use(errorHandler);

// Health check
app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "OK",
    });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;