import { Router } from "express";

// Routes
import userRoutes from "./routes/users";
import signupRoute from "./routes/signup";
import loginRoute from "./routes/login";
import notesRoutes from "./routes/notes";

const routes = () => {
  const app = Router();
  userRoutes(app);
  signupRoute(app);
  loginRoute(app);
  notesRoutes(app);

  return app;
}

export default routes;