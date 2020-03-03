"use strict";

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.regexp.to-string");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// User model schema
var UserSchema = _mongoose.default.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String
  },
  notesCollectionID: {
    type: String,
    unique: true
  }
}); // Modify the 'toJSON' method when called on a User model to manipulate what data gets returned


UserSchema.set("toJSON", {
  transform: function transform(document, returnedObject) {
    // Transform the unique generated ID from MongoDB to a string
    returnedObject.id = returnedObject._id.toString(); // Exclude properties from being returned

    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.password;
  }
}); // Hash the users password on signup and save it like that in database

UserSchema.pre("save", function (next) {
  var user = this; // Set the ID of the created user to be the ID of the notes collection

  user.notesCollectionID = user._id; // Encrypt the password

  _bcrypt.default.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    } else {
      user.password = hash;
      next();
    }
  });
}); // Create custom method for authenticating the user

UserSchema.statics.authenticate = function (username, password, callback) {
  // Find specified user
  User.findOne({
    username: username
  }).exec(function (err, user) {
    // Check if theres an error and/if the user exists
    if (err) {
      return callback(err);
    } else if (!user) {
      var error = new Error("User does not exist!");
      error.status = 404;
      return callback(error);
    } // Compare the passed password on login with the user's hashed password saved in the database


    _bcrypt.default.compare(password, user.password, function (err, result) {
      if (result) {
        return callback(null, user);
      } else {
        return callback();
      }
    });
  });
};

var User = _mongoose.default.model("User", UserSchema);

var _default = User;
exports.default = _default;