import mongoose from "mongoose";
import env from "../config/index";

const mongooseLoader = async() => {
  const connection = await mongoose.connect(env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

  return connection.connection.db;
}

export default mongooseLoader;