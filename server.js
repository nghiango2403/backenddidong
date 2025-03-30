require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const initApiRoutes = require("./routes/api");

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors());

// Routes
initApiRoutes(app);

// Xử lý route không tồn tại
app.use((req, res, next) => {
    res.status(404).json({ message: "Not found" });
});

// Kết nối MongoDB & chạy server
const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGOOSE_DB_URL);
        console.log("✅ MongoDB connected successfully");

        app.listen(port, () => {
            console.log(`🚀 Server is running on port ${port}`);
        });
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error);
        process.exit(1); // Dừng chương trình nếu không kết nối được DB
    }
};

startServer();
