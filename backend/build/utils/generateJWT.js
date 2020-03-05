"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _index = _interopRequireDefault(require("../config/index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var generateJWT = function generateJWT(res, user) {
  var expiration = 600000; // 1 minute expiration

  var payload = {
    user: user
  };
  var secret = _index.default.JWT_SECRET;
  var options = {
    expiresIn: "1m",
    issuer: "http://notes-app:heroku"
  }; // Generate the token

  var token = _jsonwebtoken.default.sign(payload, secret, options);

  return res.cookie("jwt", token, {
    expires: new Date(Date.now() + expiration),
    secure: false,
    // turn to true if using HTTPS - when hosting on heroku
    httpOnly: true
  });
};

var _default = generateJWT;
exports.default = _default;