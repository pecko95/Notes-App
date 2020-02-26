import { Router } from "express";
import Note from "../../models/note";
import User from "../../models/user";

const route = Router();

const NotesRoute = app  => {
  app.use("/notes", route);

  // Get all notes
  route.get("/", (req, res) => {
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
  })

  // Get specific note by ID
  route.get("/id/:id?", (req, res) => {
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
  route.post("/:username?", (req, res, next) => {
    const { title, body, important } = req.body;
    const username = req.params.username;

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

  })
}

export default NotesRoute;