import { Router } from "express";
import Note from "../../models/note";
import User from "../../models/user";
import validateJWT from "../../utils/jwtHandling";

const route = Router();

const NotesRoute = app  => {
  app.use("/notes", route);
  let result = {};
  let status = 200;

  // Get all notes
  route.get("/", validateJWT, (req, res) => {
    // Get ALL notes regardless of users
    const payload = req.decoded;
    if (payload && payload.user.role === "Admin") {
      Note.find({})
        .then(notes => {
          if (notes.length > 0) {
            res.json(notes.map(note => note.toJSON()));
          } else {
            res.status(404).json({
              "error": "No notes found."
            })
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
  route.get("/id/:id?", validateJWT, (req, res) => {
    const id = req.params.id;

    if (id) {
      Note.find({ id })
        .then(note => res.json(note.toJSON()))
        .catch(err => console.log("Error", err));

    } else {
      res.status(404).json({
        error: "Page does not exist!"
      });
    }
  })

  // Create a new note
  route.post("/", validateJWT, (req, res, next) => {
    const { title, body, important } = req.body;

    // Use the recieved payload username property contained in the JWT
    // to find the specific user and create the new note with his ID
    const username = req.decoded.user.username;

    if (!title || !body) {
      res.status(400).json({
        error: "Please fill all required fields!"
      });
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
                res.status(200).json({
                  "success": "Note created successfully!"
                })
              }
            })
          } else {
            res.status(404).json({
              error: "Doesnt exist"
            })
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
}

export default NotesRoute;