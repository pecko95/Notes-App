import e, { Router } from "express";
import crypto from "crypto";
import env from "../../config/index";

import User from "../../models/user";
import Note from "../../models/note";
import validateJWT from "../../utils/jwtHandling";
import bcrypt from "bcrypt";
import { transporter } from "../../utils/sendMail";

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
    if (payload && payload.role === "Admin") {
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
      if (payload && payload.role === "Admin" || payload && payload.id === id) {
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


  // Delete users
  route.delete("/:id/delete", validateJWT, (req, res) => {
    const id = req.params.id;
    const payload = req.decoded;

    // Clear result object and reset status on each request
    status = 200;
    result = {};

    // Admin can delete all user accounts. Other roles can delete only their own account
    if (payload && payload.role === "Admin" || payload && payload.id === id) {
      if (!id) {
        status = 400;
        result.status = status;
        result.error = "Provide user ID.";

        res.status(status).send(result);
      } else {
        // Find and delete a specific user
        User.findOneAndDelete({ _id: id }, (err, deletedUser) => {
          if (err) {
            status = 500;
            result.status = status;
            result.error = "Something went wrong, can't delete user.";
          } else if (!deletedUser) {
            status = 404;
            result.status = status;
            result.error = "User does not exist.";
          } else {
            status = 200;
            result.status = status;
            result.message = "User deleted successfully."
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
    
  })

  // Change password of a specific user
  route.put("/:id/changepassword", validateJWT, (req, res, next) => {
    const userID  = req.params.id;
    const payload = req.decoded;
    
    // New password and repeated new password
    const newPassword = req.body.newPassword;
    const confirmPassword = req.body.confirmPassword;

    // Allow only logged in user to change his own password
    if (payload.id === userID) {
      // Check if new password and confirmation passwords match
      if (newPassword !== confirmPassword) {
        status = 400;
        result.status = status;
        result.error = "Passwords do not match.";
        
        return result.status(status).send(result);
      }

      // Check if ID parameter is passed
      if (!userID) {
        status = 400;
        result.status = status;
        result.error = "Please provide existing user ID.";

        res.status(status).send(result);
      } else {
        // Encrypt the new password
        bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
          if (err) {
            status = 500;
            result.status = status;
            result.error = err;

            res.status(status).send(result);
          } else {
            // Check if user exists in database and update its password
            User.findOneAndUpdate({ _id: userID }, {
              $set: {
                password: hashedPassword
              }
            }, (err, user) => {

              if (err) {
                status = 500;
                result.status = status;
                result.error = err;

                res.status(status).send(result);
              } else if (!user) {
                status = 400;
                result.status = status;
                result.error = "Provide matching credentials for the user.";

                res.status(status).send(result);
              } else {
                status = 204;
                result.status = status;
                result.message = "Successfully updated password!";

                res.status(status).send(result);
              }

            })
          }
        })
      }
    }

  })

  // Allow currently logged-in user to reset his/her own password
  route.post("/resetpassword", validateJWT, (req, res, next) => {
    const payload = req.decoded;
    const { emailRecipient } = req.body;

    // Make sure email is passed into the body upon request
    if (emailRecipient) {
      // Generate a new temporary password
      const tempPassword = crypto.randomBytes(48).toString('hex').slice(0, 8);

      // Encrypt the password before saving it to the database
      bcrypt.hash(tempPassword, 10, (err, hashedPassword) => {
        if (err) {
          status = 500;
          result.status = status;
          result.error = err;

          res.status(status).send(result);
        } else {
          // Find the user in the database and update its password
          User.findOneAndUpdate({ _id: payload.id }, {
            $set: {
              password: hashedPassword
            }
          }, (err, user) => {
            if (err) {
              status = 500;
              result.status = status;
              result.error = err;

              res.status(status).send(result);
            } else if (!user) {
              status = 404;
              result.status = status;
              result.error = "User does not exist!";

              res.status(status).send(result);
            } else {
              status = 200;
              result.status  = status;
              result.success = "Password has been reset successfully!"; 
              res.status(status).send(result);

              // Set the mail options
              const mailOptions = {
                from: env.MAIL_SENDER,
                to: emailRecipient,
                subject: "Your password has been reset!",
                html: `
                <h1>Password has been successfully reset!</h1>
                
                <p>Here is your new password: <strong>${tempPassword}</strong></p> 
                
                <p>Be sure to change it after you login next time into your account!</p>
                `
                // html: fs.readFileSync('../../emails/testemail.html', { encoding: 'utf-8' });
              }

              // Send the email with the new password
              transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                  console.log(`Sending email error: ${err}`)
                } else {
                  console.log(`Email has been sent!`);
                }
              })

            }
          })
        }
      })
    } else {
      status = 400;
      result.status = status;
      result.error = "Please provide valid email address";

      res.status(status).send(result);
    }

  })
}

export default userRoutes;