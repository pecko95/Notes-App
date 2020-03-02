import express from "express";
import env from "./config/index";

async function startServer() {
  const app = express();

  // Wait for loaders to start running
  await require("./loaders").default({ expressApp: app })

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, err => {
    if (err) {
      console.log(`Something went wrong: ${err.message}`);
      process.exit(1);
    } else {
      console.log(`Server is running on port ${env.PORT}`);
    }
  })
}

startServer();