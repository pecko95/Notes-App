"use strict";

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("regenerator-runtime/runtime");

var _express = require("express");

var _user = _interopRequireDefault(require("../../models/user"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _index = _interopRequireDefault(require("../../config/index"));

var _generateJWT = _interopRequireDefault(require("../../utils/generateJWT"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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
      _user.default.authenticate(username, password,
      /*#__PURE__*/
      function () {
        var _ref = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee(err, user) {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (!err) {
                    _context.next = 6;
                    break;
                  }

                  status = 500;
                  result.status = status;
                  result.error = "".concat(err);
                  _context.next = 18;
                  break;

                case 6:
                  if (user) {
                    _context.next = 12;
                    break;
                  }

                  status = 401;
                  result.status = status;
                  result.error = "Authentication failed. Please provide matching username and password!";
                  _context.next = 18;
                  break;

                case 12:
                  // If login passes
                  status = 200; // Create the JWT

                  _context.next = 15;
                  return (0, _generateJWT.default)(res, user);

                case 15:
                  console.log("GENERATED COOKIE");
                  result.status = status;
                  result.result = user;

                case 18:
                  res.status(status).send(result);

                case 19:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        return function (_x, _x2) {
          return _ref.apply(this, arguments);
        };
      }());
    }
  });
};

var _default = loginRoute;
exports.default = _default;