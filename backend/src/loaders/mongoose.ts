import mongoose from "mongoose";
import env from "../config/index";

// Type reference
import { Db } from "mongodb";

// Mongoose connection loader - async function that waits for connection to mongodb to
// be completed and then returns the connection to be used by the application
const mongooseLoader = async(): Promise<Db> => {
  const mongoConnection = await mongoose.connect(env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

  return mongoConnection.connection.db;
}

export default mongooseLoader;