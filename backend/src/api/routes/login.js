import { Router } from "express";
import User from "../../models/user";

const route = Router();

const loginRoute = app => {
  app.use("/login", route);

  route.post("/", (req, res, next) => {
    // Get the username and password that were provided
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(403).json({
        error: "Please enter username and/or password."
      });
    } else {
      // Check if the user exists and is authenticated
      User.authenticate(username, password, (err, user) => {
        if (err || !user) {
          
          res.status(403).json({
            error: "Wrong username or password!"
          })

        } else {
          // Get data for specific user
          // res.redirect(`/api/users/id/${username}`);
          res.json(user.toJSON());
        }
      })
    }
  })
}

export default loginRoute;