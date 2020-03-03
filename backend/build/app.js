"use strict";

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

require("regenerator-runtime/runtime");

var _express = _interopRequireDefault(require("express"));

var _index = _interopRequireDefault(require("./config/index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function startServer() {
  return _startServer.apply(this, arguments);
}

function _startServer() {
  _startServer = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var app, PORT;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            app = (0, _express.default)(); // Wait for loaders to start running

            _context.next = 3;
            return require("./loaders").default({
              expressApp: app
            });

          case 3:
            PORT = process.env.PORT || _index.default.PORT || 3000;
            app.listen(PORT, function (err) {
              if (err) {
                console.log("Something went wrong: ".concat(err.message));
                process.exit(1);
              } else {
                console.log("Server is running on port ".concat(PORT));
              }
            });

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _startServer.apply(this, arguments);
}

startServer();