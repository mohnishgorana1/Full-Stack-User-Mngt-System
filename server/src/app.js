import express from "express";
import cookieParser from "cookie-parser";
import connectToDatabase from "./config/dbConfig.js";


const app = express();

// db connection
connectToDatabase();

// application middlewares
app.use(express.json()); // hey app i want to take json data from express server
app.use(cookieParser()); // hey app i want to store User token in cookie and i need when i want to check the user is there or not for logout

//*  routing
import authRouter from "./routes/auth.route.js";
app.use("/api/auth", authRouter);

// default route
app.use("/", (req, res) => {
  res.status(200).json({
    data: "JWT AUTH SERVER",
  });
});

export default app;
