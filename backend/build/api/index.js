"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _users = _interopRequireDefault(require("./routes/users"));

var _signup = _interopRequireDefault(require("./routes/signup"));

var _login = _interopRequireDefault(require("./routes/login"));

var _notes = _interopRequireDefault(require("./routes/notes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Routes
var routes = function routes() {
  var app = (0, _express.Router)();
  (0, _users.default)(app);
  (0, _signup.default)(app);
  (0, _login.default)(app);
  (0, _notes.default)(app);
  return app;
};

var _default = routes;
exports.default = _default;