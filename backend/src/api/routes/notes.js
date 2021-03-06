import { Router } from "express";
import Note from "../../models/note";
import User from "../../models/user";
import validateJWT from "../../utils/jwtHandling";

const route = Router({ mergeParams: true });

const NotesRoute = app  => {
  app.use("/notes", route);
  let result = {};
  let status = 200;

  // Get all notes
  route.get("/", validateJWT, (req, res) => {
    // Get ALL notes regardless of users
    const payload = req.decoded;
    if (payload && payload.role === "Admin") {
      Note.find({})
        .then(notes => {
          if (notes.length > 0) {
            res.json(notes.map(note => note.toJSON()));
          } else {
            status = 404;
            result.status = status;
            result.error = "No notes found!"
            
            res.status(status).send(result);
          }
  
        })
        .catch(err => console.log("Error", err));
    } else {
      status = 401;
      result.status = status;
      result.error  = "Access denied. Invalid token credentials.";

      res.status(status).send(result);
    }
  })

  // Get specific note by ID
  route.get("/:id/details", validateJWT, (req, res) => {
    const id = req.params.id;

    if (id) {
      Note.findOne({ id }, (err, note) => {
        if (err) {
          status = 400;
          result.status = status;
          result.error = `Something went wrong: ${err}`;

          res.status(status).send(result);
        } else if (!note) {
          status = 404;
          result.status = status;
          result.error = "Note does not exist!";

          res.status(status).send(result);
        } else {
          res.status(200).json(note.toJSON());
        }
      });

    } else {
      status = 404;
      result.status = status;
      result.error = "Note doesn't exist!"

      res.status(status).send(result);
    }
  })

  // Create a new note
  route.post("/", validateJWT, (req, res, next) => {
    const { title, body, important } = req.body;

    // Use the recieved payload username property contained in the JWT
    // to find the specific user and create the new note with his ID
    const username = req.decoded.user.username;

    if (!title || !body) {
      status = 400;
      result.status = status;
      result.error  = "Please fill all required fields!";

      res.status(status).send(result);
    } else {
      // ID for the user the notes belong to
      User.findOne({ username }, { notesCollectionID: 1 })
        .then(user => {
          if (user) {

            const noteData = {
              id: user.notesCollectionID,
              title,
              body,
              important,
              date: new Date(),
              createdBy: username,
              completed: false
            };

            Note.create(noteData, (err, note) => {
              if (err) {
                return next(err);
              } else {
                status = 200;
                result.status = status;
                result.error  = "Note created successfully!";

                res.status(status).send(result);
              }
            })
          } else {
            status = 404;
            result.status = status;
            result.error  = "User doesn't exist!";

            res.status(status).send(result);
          }
        })
        .catch(err => console.log("Error", err))
    }
  });

  // Get all notes that belong to a specific user
  route.get("/my", validateJWT, (req, res) => {
    const userID = req.decoded.user.id;

    if (userID) {
      Note.find({ id: userID })
        .then(notes => {
          // If notes exist
          if (notes && notes.length > 0) {
            res.json(notes.map(note => note.toJSON()));
          } else {
            status = 404;
            result.status = status;
            result.error  = "No notes found for this user.";
            res.status(status).send(result);
          }
        })
        .catch(err => console.log("ERROR", err))
    } else {
      status = 401;
      result.status = status;
      result.error = "Access denied. Invalid token credentials.";

      res.status(status).send(result);
    }

  })

  // Update specific note
  route.put("/:id/edit", validateJWT, (req, res) => {
    const id = req.params.id;
    const payload = req.decoded;
    const { title, body, important, completed } = req.body;
    status = 200;
    result = {};

    // Check if required fields are passed to the request
    if (!title || !body || !important) {
      status = 400;
      result.status = status;
      result.error = "Please fill all required fieldsss.";

      res.status(status).send(result);
    } else {
      User.findOne({ _id: payload.id }, (err, user) => {
        if (err) {
          status = 400;
          result.status = status;
          result.error = "Something went wrong";
          
          res.status(status).send(result);
        } else if (!user) {
          status = 404;
          result.status = status;
          result.error = "User does not exist";
          
          res.status(status).send(result);
        } else {
          // Check if user is admin or if the note belongs to the logged in user
          if (payload && payload.role === "Admin" || payload && payload.id === user.id) {
            // Find and update a specific note
            Note.findOneAndUpdate({ id }, {
              $set: {
                title,
                body,
                important,

                // If completed parameter is recieved upon request, update the value. If no, do nothing
                ...completed && { completed }
              }
            }, (err, updatedNote) => {
              if (err) {
                status = 400;
                result.status = status;
                result.error = "Something went wrong - cant update note"
              } else if (!updatedNote) {
                status = 404;
                result.status = status;
                result.error = "Note does not exist."
              } else {
                status = 200;
                result.status = status;
                result.message = "Successfully updated note!";
              }

              res.status(status).send(result);
            })
          } else {
            status = 401;
            result.status = status;
            result.error = "Not authorized.";

            res.status(status).send(result);
          }
        }
      })
    }

  })

  // Delete a specific note
  route.delete("/:id/delete", validateJWT, (req, res) => {
    const id = req.params.id;
    const payload = req.decoded;

    if (id) {
      User.findOne({ _id: payload.id }, (err, user) => {
        if (err) {
          status = 400;
          result.status = status;
          result.error = "Bad request!";

          res.status(status).send(result);
        } else if (!user) {
          status = 404;
          result.status = status;
          result.error = "User not found!";

          res.status(status).send(result);
        } else {
          // If the user exists, find the note belonging to that user
          if (payload && payload.role === "Admin" || payload && payload.id === user.id) {
            Note.findOneAndRemove({ id }, (err, note) => {
              if (err) {
                status = 400;
                result.status = status;
                result.error = "Something went wrong";

                res.status(status).send(result);
              } else if (!note) {
                status = 404;
                result.status = status;
                result.error = "Note does not exist!";

                res.status(status).send(result);
              } else {
                status = 200;
                result.status = status;
                result.message = "Successfully deleted note!";

                res.status(status).send(result);
              }
            })
          }
          
        }
      })
    } else {
      status = 400;
      result.status = status;
      result.error = "Bad request";

      res.status(status).send(result);
    }
  })

  // Delete ALL notes
  route.delete("/all", validateJWT, (req, res) => {
    const payload = req.decoded;
    status = 200;
    result = {};

    if (payload && payload.role === "Admin") {
      try {
        // Check if there are any notes
        Note.find({}, async(err, notes) => {
          if (err) {
            status = 400;
            result.status = status;
            result.error = `Something went wrong: ${err}`;
          } else if (!notes || notes.length < 1) {
            status = 404;
            result.status = status;
            result.error = "No notes found!";
          } else {
            // Check if the user is an ADMIN to allow deleting all notes
            const deletedAllNotes = await Note.deleteMany({}, { w: 'majority', wtimeout: 250 });
    
            if (deletedAllNotes.ok === 1) {
              status = 200;
              result.status = status;
              result.message = "Successfully deleted all notes!";
            } else {
              status = 400;
              result.status = status;
              result.error = "Could not delete all notes!";
            }
          }

          // Send the response back
          res.status(status).send(result);
        })
      } catch(err) {
        status = 500;
        result.status = status;
        result.error = `Something went wrong! ${err}`;
      }
    } else {
      status = 401;
      result.status = status;
      result.error = "Not authorized";

      res.status(status).send(result);
    }
  })
}

export default NotesRoute;