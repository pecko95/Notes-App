import { Router } from "express";

// Routes
import userRoutes from "./routes/users";
import signupRoute from "./routes/signup";
import notesRoutes from "./routes/notes";
import authRoutes from "./routes/auth";
import resetRoute from "./routes/reset";

const routes = () => {
  const app = Router();
  userRoutes(app);
  signupRoute(app);
  authRoutes(app);
  notesRoutes(app);
  resetRoute(app);

  return app;
}

export default routes;