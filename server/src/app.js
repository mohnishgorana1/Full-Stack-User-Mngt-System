import express from "express";
import connectToDatabase from './config/dbConfig.js'

const app = express();


// db connection
connectToDatabase();

// application middlewares


//*  routing
import authRouter from './routes/auth.route.js'
app.use('/api/auth', authRouter);


// default route
app.use("/", (req, res) => {
  res.status(200).json({
    data: "JWT AUTH SERVER",
  });
});


export default app;
