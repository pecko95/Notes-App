import e, { Router } from "express";

import User from "../../models/user";
import Note from "../../models/note";
import validateJWT from "../../utils/jwtHandling";

// Initialize the router
const route = Router();

const userRoutes = app => {
  app.use("/users", route);
  let result = {}
  let status = 200;

  // Get all users
  route.get("/", validateJWT, (req, res) => {
    const payload = req.decoded;

    // Check if payload exists and the users role
    if (payload && payload.user.role === "Admin") {
      User.find({}).then(users => {
        res.json(users.map(user => user.toJSON()));
      })
    } else {
      result.status = 401;
      result.error  = "Access Denied. Invalid token credentials."

      res.status(status).send(result);
    }
  })

  // Get specific user
  route.get("/id/:id?", validateJWT, (req, res, next) => {
    const id = req.params.id;
    const payload = req.decoded;

    if (payload && payload.user.role === "Admin") {
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
          .catch(err => console.log("ERROR: ", err.message))
      }
    } else {
      status = 401;
      result.status = status;
      result.error = "Access Denied. Invalid token credentials.";

      res.status(status).send(result);
    }


  })

  // Search for users - firstname, lastname and/or username
  route.get("/search/:searchParam?", validateJWT, (req, res) => {
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
      }).catch(err => console.log("ERROR: ", err))
    } else {
      // Find all users
      User.find({})
        .then(users => res.json(users.map(user => user.toJSON())))
        .catch(err => console.log("ERROR: ", err))
    }

  })

  // Get all notes that belong to a specific user
  route.get("/:id?/notes", validateJWT, (req, res, next) => {
    const id = req.params.id;

    if (typeof id !== "undefined") {
      // Search trough the DB to find and return ALL notes that have the ID of the user's ID
      Note.find({ id })
        .then(notes => {
          if (notes) {
            res.json(notes.map(note => note.toJSON()))
          } else {
            res.status(404).json({
              error: "No notes found!"
            })
          }
        })
        .catch(err => console.log("ERROR: ", err))
    } else {
      return next();
    }
  })

}

export default userRoutes;