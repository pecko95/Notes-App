import { Router } from "express";
import usersRoute from "./routes/users";

// Import all the routes here and then export them as defaults to be used by the application
const apiRoutes = () => {
  const app = Router();
  usersRoute(app);

  return app;
}

export default apiRoutes;