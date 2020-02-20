import { Router } from "express";

// Routes
import userRoutes from "./routes/users";
import signupRoute from "./routes/signup";
import loginRoute from "./routes/login";

const routes = () => {
  const app = Router();
  userRoutes(app);
  signupRoute(app);
  loginRoute(app);

  return app;
}

export default routes;