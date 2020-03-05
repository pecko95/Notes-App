"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

require("core-js/modules/es.array.find");

require("core-js/modules/es.array.map");

require("core-js/modules/web.url.to-json");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireWildcard(require("express"));

var _user = _interopRequireDefault(require("../../models/user"));

var _note = _interopRequireDefault(require("../../models/note"));

var _jwtHandling = _interopRequireDefault(require("../../utils/jwtHandling"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// Initialize the router
var route = (0, _express.Router)();

var userRoutes = function userRoutes(app) {
  app.use("/users", route);
  var result = {};
  var status = 200; // Get all users

  route.get("/", _jwtHandling.default, function (req, res) {
    var payload = req.decoded; // Clear result object and reset status on each request

    status = 200;
    result = {}; // Check if payload exists and the users role

    if (payload && payload.user.role === "Admin") {
      _user.default.find({}).then(function (users) {
        res.json(users.map(function (user) {
          return user.toJSON();
        }));
      });
    } else {
      result.status = 401;
      result.error = "Access Denied. Invalid token credentials.";
      res.status(status).send(result);
    }
  }); // Get specific user

  route.get("/id/:id?", _jwtHandling.default, function (req, res, next) {
    var id = req.params.id;
    var payload = req.decoded; // Clear result object and reset status on each request

    status = 200;
    result = {}; // Check if id was passed as parameter

    if (!id) {
      status = 404;
      result.status = status;
      result.error = "User not found!";
      res.status(status).send(result);
    } else {
      // Query the DB for the unique username and check if it exists
      _user.default.findOne({
        _id: id
      }).then(function (user) {
        if (user) {
          res.json(user.toJSON());
        } else {
          status = 404;
          result.status = status;
          result.error = "User not found!";
          res.status(status).send(result);
        }
      }).catch(function (err) {
        return console.log("ERROR: ", err.message);
      });
    }
  }); // Search for users - firstname, lastname and/or username

  route.get("/search/:searchParam?", _jwtHandling.default, function (req, res) {
    var searchParam = req.params.searchParam; // Clear result object and reset status on each request

    status = 200;
    result = {}; // Check if a search parameter was passed

    if (typeof searchParam != "undefined") {
      // Use multiple find conditions to query the DB
      _user.default.find({
        $or: [{
          first_name: {
            $regex: searchParam,
            $options: "$i"
          }
        }, {
          last_name: {
            $regex: searchParam,
            $options: "$i"
          }
        }, {
          username: {
            $regex: searchParam,
            $options: "$i"
          }
        }]
      }).then(function (users) {
        if (users) {
          res.json(users.map(function (user) {
            return user.toJSON();
          }));
        } else {
          status = 404;
          result.status = status;
          result.error = "User not found!";
          res.status(status).send(result);
        }
      }).catch(function (err) {
        return console.log("ERROR: ", err);
      });
    } else {
      // Find all users
      _user.default.find({}).then(function (users) {
        return res.json(users.map(function (user) {
          return user.toJSON();
        }));
      }).catch(function (err) {
        return console.log("ERROR: ", err);
      });
    }
  }); // Get all notes that belong to a specific user

  route.get("/:id?/notes", _jwtHandling.default, function (req, res, next) {
    var id = req.params.id; // Clear result object and reset status on each request

    status = 200;
    result = {};

    if (typeof id !== "undefined") {
      // Search trough the DB to find and return ALL notes that have the ID of the user's ID
      _note.default.find({
        id: id
      }).then(function (notes) {
        if (notes) {
          res.json(notes.map(function (note) {
            return note.toJSON();
          }));
        } else {
          status = 404;
          result.status = status;
          result.error = "User has no notes!";
          res.status(status).send(result);
        }
      }).catch(function (err) {
        return console.log("ERROR: ", err);
      });
    } else {
      return next();
    }
  }); // Update specific user

  route.put("/:id/edit", _jwtHandling.default, function (req, res, next) {
    var id = req.params.id;
    var payload = req.decoded;
    var _req$body = req.body,
        username = _req$body.username,
        first_name = _req$body.first_name,
        last_name = _req$body.last_name; // Clear result object and reset status on each request

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
      if (payload && payload.user.role === "Admin" || payload && payload.user.id === id) {
        // Check if user's ID is passed
        if (!id) {
          status = 401;
          result.status = status;
          result.error = "Provide user ID.";
          res.status(status).send(result);
        } else {
          _user.default.findOneAndUpdate({
            _id: id
          }, {
            $set: {
              username: username,
              first_name: first_name,
              last_name: last_name
            }
          }, function (err, updatedUser) {
            if (err) {
              status = 500;
              result.status = status;
              result.error = "Something went wrong. Can't update the user!";
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
          });
        }
      } else {
        status = 401;
        result.status = status;
        result.error = "Not authorized.";
        res.status(status).send(result);
      }
    }
  }); // Delete users

  route.delete("/:id/delete", _jwtHandling.default, function (req, res) {
    var id = req.params.id;
    var payload = req.decoded; // Clear result object and reset status on each request

    status = 200;
    result = {}; // Admin can delete all user accounts. Other roles can delete only their own account

    if (payload && payload.user.role === "Admin" || payload && payload.user.id === id) {
      if (!id) {
        status = 400;
        result.status = status;
        result.error = "Provide user ID.";
        res.status(status).send(result);
      } else {
        // Find and delete a specific user
        _user.default.findOneAndDelete({
          _id: id
        }, function (err, deletedUser) {
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
            result.message = "User deleted successfully.";
          }

          res.status(status).send(result);
        });
      }
    } else {
      status = 401;
      result.status = status;
      result.error = "Not authorized.";
      res.status(status).send(result);
    }
  });
};

var _default = userRoutes;
exports.default = _default;