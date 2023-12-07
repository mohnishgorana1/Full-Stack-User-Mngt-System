import mongoose from "mongoose";

const MONGODB_URL = String(process.env.MONGODB_URL);


const connectToDatabase = async () => {
  await mongoose
    .connect(MONGODB_URL)
    .then((conn) => console.log(`Connected to DB : ${conn.connection.host}`))
    .catch((err) => console.log(`Error connecting to DB : ${err.message}`));
};

export default connectToDatabase;
