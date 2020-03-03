"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _user = _interopRequireDefault(require("../../models/user"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _index = _interopRequireDefault(require("../../config/index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var route = (0, _express.Router)();

var loginRoute = function loginRoute(app) {
  app.use("/login", route);
  route.post("/", function (req, res, next) {
    // Get the username and password that were provided
    var _req$body = req.body,
        username = _req$body.username,
        password = _req$body.password;
    var result = {};
    var status = 200;

    if (!username || !password) {
      status = 403;
      result.status = status;
      result.error = "Please enter username and/or password.";
      res.status(status).send(result);
    } else {
      // Check if the user exists and is authenticated
      _user.default.authenticate(username, password, function (err, user) {
        if (err) {
          status = 500;
          result.status = status;
          result.error = "".concat(err);
        } else if (!user) {
          status = 401;
          result.status = status;
          result.error = "Authentication failed. Please provide matching username and password!";
        } else {
          // If login passes
          status = 200; // Create the JWT

          var payload = {
            user: user
          }; // Options - exipiry date, issued by etc.

          var options = {
            expiresIn: "1h",
            issuer: "http://notes-app:heroku"
          }; // JWT Secret from ENV

          var secret = _index.default.JWT_SECRET; // Sign the token

          var token = _jsonwebtoken.default.sign(payload, secret, options); // Return the token details as a response


          result.token = token;
          result.status = status;
          result.result = user;
        }

        res.status(status).send(result);
      });
    }
  });
};

var _default = loginRoute;
exports.default = _default;