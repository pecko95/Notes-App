"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _user = _interopRequireDefault(require("../../models/user"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var route = (0, _express.Router)();

var signupRoute = function signupRoute(app) {
  app.use("/signup", route); // Create new user

  route.post("/", function (req, res, next) {
    // Get required field values
    var _req$body = req.body,
        username = _req$body.username,
        first_name = _req$body.first_name,
        last_name = _req$body.last_name,
        password = _req$body.password,
        role = _req$body.role;

    if (!username || !first_name || !last_name || !password || !role) {
      res.status(400).json({
        error: "Please enter all required fields!"
      });
    } else {
      // Provided data for the user
      var userData = {
        username: username,
        first_name: first_name,
        last_name: last_name,
        password: password,
        role: role
      }; // Create a new User document with provided data

      _user["default"].create(userData, function (err, user) {
        if (err) {
          // Return  custom error if user already exists
          if (err.code === 11000) {
            res.status(400).json({
              error: "User already exists!"
            });
          } else {
            return next(err);
          }
        } else {
          res.status(201).json({
            "success": "User created successfully!"
          });
        }
      });
    }
  });
};

var _default = signupRoute;
exports["default"] = _default;