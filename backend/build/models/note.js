"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Notes model schema
var NotesSchema = _mongoose["default"].Schema({
  id: String,
  title: String,
  body: String,
  date: Date | String,
  createdBy: String,
  important: Boolean,
  completed: Boolean
}); // Dont return unused fields


NotesSchema.set("toJSON", {
  transform: function transform(document, returnedObject) {
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

var Note = _mongoose["default"].model("Note", NotesSchema);

var _default = Note;
exports["default"] = _default;