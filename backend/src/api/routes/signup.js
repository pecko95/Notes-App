import { Router } from "express";
import User from "../../models/user";

const route = Router();

const signupRoute = app => {
  app.use("/signup", route);

  // Create new user
  route.post("/", (req, res, next) => {
    // Get required field values
    const { username, first_name, last_name, password } = req.body;

    if (!username || !first_name || !last_name || !password) {
      res.status(400).json({
        error: "Please enter all required fields!"
      })
    } else {
      // Provided data for the user
      const userData = {
        username,
        first_name,
        last_name,
        password
      };

      // Create a new User document with provided data
      User.create(userData, (err, user) => {
        if (err) {
          // Return  custom error if user already exists
          if (err.code === 11000) {
            res.status(400).json({
              error: "User already exists!"
            });
          } else {
            return next(err);
          }
        } else {
          res.status(201).json({
            "success": "User created successfully!"
          })
        }
      });
      
    }
  })
}

export default signupRoute;