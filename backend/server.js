require("dotenv").config();
const express=require("express");
const cors=require("cors");
const path=require("path");
const connectDB=require("./config/db");
const authRoutes=require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");


const app=express();

app.use(
    cors({
        origin: ["http://localhost:5173", "https://fundora-seven.vercel.app"],
        methods: ["GET","POST","PUT","DELETE"],
        allowedHeaders:["Content-Type","Authorization"],
    })
);

app.use(express.json());
connectDB();

app.use("/api/v1/auth", authRoutes);

app.use("/uploads", express.static(path.join(__dirname,"uploads")));
app.use("/api/v1/projects", projectRoutes);

const PORT =process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));