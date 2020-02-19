import dotenv from "dotenv";

dotenv.config();

// Export the ENV variables to be usable everywhere
export default {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI
}