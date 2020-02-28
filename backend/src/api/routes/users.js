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

    // Clear result object and reset status on each request
    status = 200;
    result = {};

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
    // Clear result object and reset status on each request
    status = 200;
    result = {};

    if (payload && payload.user.role === "Admin") {
      // Check if id was passed as parameter
      if (!id) {
        status = 404;
        result.status = status;
        result.error  = "User not found!";

        res.status(status).send(result);
      } else {
        // Query the DB for the unique username and check if it exists
        User.findOne({ _id: id })
          .then(user => {
            if (user) {
              res.json(user.toJSON());
            } else {
              status = 404;
              result.status = status;
              result.error  = "User not found!";

              res.status(status).send(result);
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
    // Clear result object and reset status on each request
    status = 200;
    result = {};
    
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
          status = 404;
          result.status = status;
          result.error  = "User not found!";

          res.status(status).send(result);
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
    // Clear result object and reset status on each request
    status = 200;
    result = {};

    if (typeof id !== "undefined") {
      // Search trough the DB to find and return ALL notes that have the ID of the user's ID
      Note.find({ id })
        .then(notes => {
          if (notes) {
            res.json(notes.map(note => note.toJSON()))
          } else {
            status = 404;
            result.status = status;
            result.error  = "User has no notes!";
    
            res.status(status).send(result);
          }
        })
        .catch(err => console.log("ERROR: ", err))
    } else {
      return next();
    }
  })

  // Update specific user
  route.put("/:id/edit", validateJWT, (req, res, next) => {
    const id = req.params.id;
    const payload = req.decoded;
    const { username, first_name, last_name } = req.body;

    // Clear result object and reset status on each request
    status = 200;
    result = {};

    if (!username || !first_name || !last_name) {
      status = 400;
      result.status = status;
      result.error = "Please fill all required fields.";

      res.status(status).send(result);
    } else {
      // If required values are sent check for role and if ID was passed as parameter
      // Allow user details to be updated if:
      // 1. Current user is Admin - can update every user details
      // 2. Current logged in user tries to update his own details
      if (payload && payload.user.role === "Admin" || payload && payload.user.id === id) {
        // Check if user's ID is passed
        if (!id) {
          status = 401;
          result.status = status;
          result.error = "Provide user ID.";
    
          res.status(status).send(result);
        } else {
          User.findOneAndUpdate({ _id: id }, {
            $set: {
              username,
              first_name,
              last_name
            }
          }, (err, updatedUser) => {
            if (err) {
              status = 500;
              result.status = status;
              result.error = "Something went wrong. Can't update the user!"
            } else if (!updatedUser) {
              status = 400;
              result.status = status;
              result.error = "User does not exist!";
            } else {
              // If user exists
              status = 200;
              result.status = status;
              result.message = "User updated successfully!";
            }

            res.status(status).send(result);
          })
        }
      } else {
        status = 401;
        result.status = status;
        result.error = "Not authorized.";
  
        res.status(status).send(result);
      }
    }

  })

}

export default userRoutes;