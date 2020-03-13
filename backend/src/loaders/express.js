import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import routes from "../api";
import cookieParser from "cookie-parser";

const expressApp = async({ app }) => {
  // Checks for health status
  app.get("/status", (req, res) => {
    res.status(200).end();
  });
  app.head("/status", (req, res) => {
    res.status(200).end();
  });

  // Transform strings from requests to JSON
  app.use(bodyParser.json());

  // Allow CORS
  app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
  }));

  // Set global content type configuration
  app.use((req, res, next) => {
    res.header("Content-Type", "application/json");

    next();
  })

  app.use(cookieParser());

  // API routes
  app.use("/api", routes());
};

export default expressApp;