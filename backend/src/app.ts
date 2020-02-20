import express from "express";
import env from "./config/index";

async function startServer() {
  const app = express();

  // Wait for the loaders to be fully loaded and running,
  // then use the imported expressApplication as the application to listen to
  await require("./loaders").default({ expressApp: app })

  app.listen(env.PORT, (err: Error) => {
    if (err) {
      console.log("Error: ", err.message);
      process.exit(1);
    }

    console.log(`Server is running on port: ${env.PORT}`);
  })
}

startServer();