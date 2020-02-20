// Configure express
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import apiRoutes from "../api";

const expressApplication = ({ app }: { app: express.Application }) => {
  // Health checks
  app.get("/status", (req, res) => {
    res.status(200).end();
  });

  app.head("/status", (req, res) => {
    res.status(200).end();
  })

  // Transform strings into JSON
  app.use(bodyParser.json());

  // Allow CORS
  app.use(cors());

  // Load the API routes
  app.use("/api", apiRoutes())
}

export default expressApplication;