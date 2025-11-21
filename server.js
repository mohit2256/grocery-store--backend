import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";


dotenv.config();
connectDB();

const app = express();
app.use(
  cors({
    origin: ["https://lalaandsons.netlify.app", "http://localhost:3000"],
    
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);


// Health check route
app.get("/", (req, res) => {
  res.send("✅ Grocery Backend is running successfully!");
});

const PORT = process.env.PORT || 5000;
console.log("👉 userRoutes loaded:", userRoutes);
app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);