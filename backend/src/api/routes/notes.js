import { Router } from "express";
import Note from "../../models/note";

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
  route.post("/", (req, res) => {
    const { title, body, important } = req.body;

    if (!title || !body) {
      res.status(400).json({
        error: "Please fill all required fields!"
      });
    } else {
      const noteData = {
        title,
        body,
        important: important ? important : false,
        date: new Date(),
        createdBy: "",
        completed: false
      }

      // Create a new note and save it to database
      Note.create(noteData, (err, note) => {
        if (err) {
          return next(err);
        } else {
          res.status(201).json({
            "success": "Note created successfully!"
          })
        }
      });
    }

  })
}

export default NotesRoute;