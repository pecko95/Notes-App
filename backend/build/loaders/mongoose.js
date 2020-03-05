"use strict";

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("regenerator-runtime/runtime");

var _mongoose = _interopRequireDefault(require("mongoose"));

var _index = _interopRequireDefault(require("../config/index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var mongooseLoader =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var URI, connection;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            URI = _index.default.MONGODB_URI;
            _context.next = 3;
            return _mongoose.default.connect(URI, {
              useNewUrlParser: true,
              useUnifiedTopology: true,
              useCreateIndex: true
            });

          case 3:
            connection = _context.sent;
            return _context.abrupt("return", connection.connection.db);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function mongooseLoader() {
    return _ref.apply(this, arguments);
  };
}();

var _default = mongooseLoader;
exports.default = _default;