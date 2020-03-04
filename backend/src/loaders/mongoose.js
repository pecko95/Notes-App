import mongoose from "mongoose";
import env from "../config/index";

const mongooseLoader = async() => {
  const URI = env.MONGODB_URI;
  const connection = await mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

  return connection.connection.db;
}

export default mongooseLoader;