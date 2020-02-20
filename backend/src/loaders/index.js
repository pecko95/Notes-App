import expressLoader from "./express";
import mongooseLoader from "./mongoose";

const loader = async({ expressApp }) => {
  // Wait for mongoose to establish connection to MongoDB
  await mongooseLoader();
  console.log("Successfully connected to MongoDB.");

  await expressLoader({ app: expressApp });
  console.log("Express server is now running.");
};

export default loader;