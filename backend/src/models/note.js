import mongoose from "mongoose";

// Notes model schema
const NotesSchema = mongoose.Schema({
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
    // Transform the ID into a string
    returnedObject.id = returnedObject._id.toString();

    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Note = mongoose.model("Note", NotesSchema);

export default Note;