"use strict";

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("regenerator-runtime/runtime");

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _index = _interopRequireDefault(require("../config/index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var validateJWT =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res, next) {
    var token, status, result, decryptedToken;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // Check if token exists in the request
            token = req.cookies.jwt || '';
            status = 200;
            result = {};
            _context.prev = 3;

            if (!token) {
              status = 401;
              result.status = status;
              result.error = "Not authorized. You need to log in.";
              res.status(status).send(result);
            }

            _context.next = 7;
            return _jsonwebtoken.default.verify(token, _index.default.JWT_SECRET);

          case 7:
            decryptedToken = _context.sent;
            req.decoded = decryptedToken;
            next();
            _context.next = 15;
            break;

          case 12:
            _context.prev = 12;
            _context.t0 = _context["catch"](3);
            console.log("ERROR: ".concat(_context.t0)); // status = 400;
            // result.status = status;
            // result.error = `${err.message}`;
            // res.status(status).send(result);

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[3, 12]]);
  }));

  return function validateJWT(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var _default = validateJWT;
exports.default = _default;