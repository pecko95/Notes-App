"use strict";

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.string.split");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _index = _interopRequireDefault(require("../config/index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validateJWT(req, res, next) {
  var authorizationHeader = req.headers.authorization;
  var result = {}; // Check if authorization exists

  if (authorizationHeader) {
    // Get the token - in this case Bearer Token
    var token = req.headers.authorization.split(' ')[1]; // -> "Authorization": `Bearer ${token} = get the 'token' value
    // Options to verify the reiceved token with - must match the options we provide

    var options = {
      expiresIn: "1h",
      issuer: "http://localhost:testing"
    };

    try {
      // jwt.verify() - ensures the token is provided by us and not expired
      result = _jsonwebtoken.default.verify(token, _index.default.JWT_SECRET, options); // Pass the DECODED token back to the request object

      req.decoded = result;
      next();
    } catch (err) {
      // throw new Error(err); // Generic error..
      // Custom error
      result.status = 401;
      result.error = "Invalid JWT. Be sure to login with existing username / password first.";
      res.status(result.status).send(result);
    }
  } else {
    // Authorization fails if there is no authorization header passed.
    result.status = 401;
    result.error = "Authentication failed. Invalid token credentials.";
    res.status(401).send(result);
  }
}

var _default = validateJWT;
exports.default = _default;