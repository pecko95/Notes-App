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

  app.use(cookieParser());

  // API routes
  app.use("/api", routes());
};

export default expressApp;