import { Router, Request, Response } from "express";

// Initialize router
const route = Router();

const usersRoute = (app: Router) => {
  app.use("/users", route);

  route.get("/test", (req: Request, res: Response) => {
    return res.send("<h3>Test User #2</h3>")
  });
}

export default usersRoute;