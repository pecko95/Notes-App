import { Router } from "express";

import User from "../../models/user";

// Initialize the router
const route = Router();

const userRoutes = app => {
  app.use("/users", route);

  // Get all users
  route.get("/", (req, res) => {
    User.find({}).then(users => {
      res.json(users.map(user => user.toJSON()));
    })
  })

  // Get specific user
  route.get("/:username", (req, res) => {
    const username = req.params.username;

    // Query the DB for the unique username and check if it exists
    User.findOne({ username })
      .then(user => {
        if (user) {
          res.json(user.toJSON());
        } else {
          res.status(404).json({
            error: "User not found!"
          })
        }
      })
      .catch(err => console.log("Error", err.message))
  })

  // Search user by username ONLY - for now
  route.get("/search/:username", (req, res) => {
    const username = req.params.username;

    User.find({ username }).then(users => {
      res.json(users.map(user => user.toJSON()))
    })
  })
}

export default userRoutes;