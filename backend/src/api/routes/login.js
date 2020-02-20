import { Router } from "express";
import User from "../../models/user";

const route = Router();

const loginRoute = app => {
  app.use("/login", route);

  route.post("/", (req, res, next) => {
    // Get the username and password that were provided
    const { username, password } = req.body;

    if (!username || !password) {
      const error = new Error("Please enter username and/or password!");
      error.status = 403;

      res.status(403).json({
        error: "Please enter username and/or password!"
      })

      // return next(error);
    } else {
      // Check if the user exists and is authenticated
      User.authenticate(username, password, (err, user) => {
        if (err || !user) {
          
          res.status(403).json({
            error: "Wrong username or password!"
          })

        } else {
          // Get data for specific user
          res.redirect(`/api/users/${username}`);
        }
      })
    }
  })
}

export default loginRoute;