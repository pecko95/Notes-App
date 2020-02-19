import express from "express";
import env from "./config/index";


function startServer() {
  const app = express();

  app.listen(env.PORT, (err: Error) => {
    if (err) {
      console.log("Error: ", err.message);
      process.exit(1);
    }

    console.log(`Server is running on port: ${env.PORT}`);
  })
}

startServer();