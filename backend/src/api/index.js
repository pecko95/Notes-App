import { Router } from "express";

// Routes
import userRoutes from "./routes/users";

const routes = () => {
  const app = Router();
  userRoutes(app);
  
  return app;
}

export default routes;