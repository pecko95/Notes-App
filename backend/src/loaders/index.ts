import expressLoader from "./express";
import mongooseLoader from "./mongoose";

// Main loader to be used in app.ts entry point that
// waits for every sub-loader to finish and start the application
const loader = async({ expressApp }) => {
  await mongooseLoader();
  console.log("MongoDB connection established."); 

  await expressLoader({ app: expressApp })
  console.log("Express app is running.");
}

export default loader;