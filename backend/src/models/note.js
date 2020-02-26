import mongoose from "mongoose";

// Notes model schema
const NotesSchema = mongoose.Schema({
  id: String,
  title: String,
  body: String,
  date: Date | String,
  createdBy: String,
  important: Boolean,
  completed: Boolean
});

// Dont return unused fields
NotesSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Note = mongoose.model("Note", NotesSchema);

export default Note;