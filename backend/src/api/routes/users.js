import { Router } from "express";

// Initialize the router
const route = Router();

const userRoutes = app => {
  app.use("/users", route);

  route.get("/test", (req, res) => {
    return res.send("<h1>TEST USER</h1>");
  })
}

export default userRoutes;