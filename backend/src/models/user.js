import mongoose from "mongoose";
import bcrypt from "bcrypt";

// User model schema
const UserSchema = mongoose.Schema({
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
})

// Modify the 'toJSON' method when called on a User model to manipulate what data gets returned
UserSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    // Transform the unique generated ID from MongoDB to a string
    returnedObject.id = returnedObject._id.toString();

    // Exclude properties from being returned
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.password;
  }
})

// Hash the users password on signup and save it like that in database
UserSchema.pre("save", function(next) {
  const user = this;

  // Set the ID of the created user to be the ID of the notes collection
  user.notesCollectionID = user._id;

  // Encrypt the password
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    } else {
      user.password = hash;

      next();
    }
  })
})

// Create custom method for authenticating the user
UserSchema.statics.authenticate = function(username, password, callback) {
  // Find specified user
  User.findOne({ username }).exec((err, user) => {
    // Check if theres an error and/if the user exists
    if (err) {
      return callback(err);
    } else if (!user) {
      const error = new Error("User does not exist!");
      error.status = 404;

      return callback(error);
    }

    // Compare the passed password on login with the user's hashed password saved in the database
    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        return callback(null, user);
      } else {
        return callback();
      }
    });

  })
}

const User = mongoose.model("User", UserSchema);

export default User;
