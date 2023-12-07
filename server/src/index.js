import dotenv from "dotenv";
import app from "./app.js";
import connectToDatabase from './config/dbConfig.js'
dotenv.config({
  path: "./env",
});

connectToDatabase();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`SERVER UP At http://localhost:${PORT}`);
})