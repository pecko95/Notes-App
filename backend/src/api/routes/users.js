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
  route.get("/id/:id?", (req, res, next) => {
    const id = req.params.id;

    // Check if id was passed as parameter
    if (!id) {
      res.status(404).json({
        error: "User not found!"
      })
    } else {
      // Query the DB for the unique username and check if it exists
      User.findOne({ _id: id })
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
    }

  })

  // Search for users - firstname, lastname and/or username
  route.get("/search/:searchParam?", (req, res) => {
    const searchParam = req.params.searchParam;
    
    // Check if a search parameter was passed
    if (typeof searchParam != "undefined") {
      // Use multiple find conditions to query the DB
      User.find({
        $or: [
          {
            first_name: { $regex: searchParam, $options: "$i" }
          },
          {
            last_name:  { $regex: searchParam, $options: "$i" }
          },
          {
            username:   { $regex: searchParam, $options: "$i" }
          }
        ]
      }).then(users => {
        if (users) {
          res.json(users.map(user => user.toJSON()))
        } else {
          res.status(400).json({
            error: "User not found!zxc"
          })
        }
      }).catch(err => console.log("Error", err))
    } else {
      // Find all users
      User.find({})
        .then(users => res.json(users.map(user => user.toJSON())))
        .catch(err => console.log("Error", err))
    }

  })

}

export default userRoutes;