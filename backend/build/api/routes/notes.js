"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _note = _interopRequireDefault(require("../../models/note"));

var _user = _interopRequireDefault(require("../../models/user"));

var _jwtHandling = _interopRequireDefault(require("../../utils/jwtHandling"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var route = (0, _express.Router)({
  mergeParams: true
});

var NotesRoute = function NotesRoute(app) {
  app.use("/notes", route);
  var result = {};
  var status = 200; // Get all notes

  route.get("/", _jwtHandling["default"], function (req, res) {
    // Get ALL notes regardless of users
    var payload = req.decoded;

    if (payload && payload.user.role === "Admin") {
      _note["default"].find({}).then(function (notes) {
        if (notes.length > 0) {
          res.json(notes.map(function (note) {
            return note.toJSON();
          }));
        } else {
          status = 404;
          result.status = status;
          result.error = "No notes found!";
          res.status(status).send(result);
        }
      })["catch"](function (err) {
        return console.log("Error", err);
      });
    } else {
      status = 401;
      result.status = status;
      result.error = "Access denied. Invalid token credentials.";
      res.status(status).send(result);
    }
  }); // Get specific note by ID

  route.get("/:id/details", _jwtHandling["default"], function (req, res) {
    var id = req.params.id;

    if (id) {
      _note["default"].findOne({
        id: id
      }, function (err, note) {
        if (err) {
          status = 400;
          result.status = status;
          result.error = "Something went wrong: ".concat(err);
          res.status(status).send(result);
        } else if (!note) {
          status = 404;
          result.status = status;
          result.error = "Note does not exist!";
          res.status(status).send(result);
        } else {
          res.status(200).json(note.toJSON());
        }
      });
    } else {
      status = 404;
      result.status = status;
      result.error = "Note doesn't exist!";
      res.status(status).send(result);
    }
  }); // Create a new note

  route.post("/", _jwtHandling["default"], function (req, res, next) {
    var _req$body = req.body,
        title = _req$body.title,
        body = _req$body.body,
        important = _req$body.important; // Use the recieved payload username property contained in the JWT
    // to find the specific user and create the new note with his ID

    var username = req.decoded.user.username;

    if (!title || !body) {
      status = 400;
      result.status = status;
      result.error = "Please fill all required fields!";
      res.status(status).send(result);
    } else {
      // ID for the user the notes belong to
      _user["default"].findOne({
        username: username
      }, {
        notesCollectionID: 1
      }).then(function (user) {
        if (user) {
          var noteData = {
            id: user.notesCollectionID,
            title: title,
            body: body,
            important: important,
            date: new Date(),
            createdBy: username,
            completed: false
          };

          _note["default"].create(noteData, function (err, note) {
            if (err) {
              return next(err);
            } else {
              status = 200;
              result.status = status;
              result.error = "Note created successfully!";
              res.status(status).send(result);
            }
          });
        } else {
          status = 404;
          result.status = status;
          result.error = "User doesn't exist!";
          res.status(status).send(result);
        }
      })["catch"](function (err) {
        return console.log("Error", err);
      });
    }
  }); // Get all notes that belong to a specific user

  route.get("/my", _jwtHandling["default"], function (req, res) {
    var userID = req.decoded.user.id;

    if (userID) {
      _note["default"].find({
        id: userID
      }).then(function (notes) {
        // If notes exist
        if (notes && notes.length > 0) {
          res.json(notes.map(function (note) {
            return note.toJSON();
          }));
        } else {
          status = 404;
          result.status = status;
          result.error = "No notes found for this user.";
          res.status(status).send(result);
        }
      })["catch"](function (err) {
        return console.log("ERROR", err);
      });
    } else {
      status = 401;
      result.status = status;
      result.error = "Access denied. Invalid token credentials.";
      res.status(status).send(result);
    }
  }); // Update specific note

  route.put("/:id/edit", _jwtHandling["default"], function (req, res) {
    var id = req.params.id;
    var payload = req.decoded;
    var _req$body2 = req.body,
        title = _req$body2.title,
        body = _req$body2.body,
        important = _req$body2.important,
        completed = _req$body2.completed;
    status = 200;
    result = {}; // Check if required fields are passed to the request

    if (!title || !body || !important) {
      status = 400;
      result.status = status;
      result.error = "Please fill all required fieldsss.";
      res.status(status).send(result);
    } else {
      _user["default"].findOne({
        _id: payload.user.id
      }, function (err, user) {
        if (err) {
          status = 400;
          result.status = status;
          result.error = "Something went wrong";
          res.status(status).send(result);
        } else if (!user) {
          status = 404;
          result.status = status;
          result.error = "User does not exist";
          res.status(status).send(result);
        } else {
          // Check if user is admin or if the note belongs to the logged in user
          if (payload && payload.user.role === "Admin" || payload && payload.user.id === user.id) {
            // Find and update a specific note
            _note["default"].findOneAndUpdate({
              id: id
            }, {
              $set: _objectSpread({
                title: title,
                body: body,
                important: important
              }, completed && {
                completed: completed
              })
            }, function (err, updatedNote) {
              if (err) {
                status = 400;
                result.status = status;
                result.error = "Something went wrong - cant update note";
              } else if (!updatedNote) {
                status = 404;
                result.status = status;
                result.error = "Note does not exist.";
              } else {
                status = 200;
                result.status = status;
                result.message = "Successfully updated note!";
              }

              res.status(status).send(result);
            });
          } else {
            status = 401;
            result.status = status;
            result.error = "Not authorized.";
            res.status(status).send(result);
          }
        }
      });
    }
  }); // Delete a specific note

  route["delete"]("/:id/delete", _jwtHandling["default"], function (req, res) {
    var id = req.params.id;
    var payload = req.decoded;

    if (id) {
      _user["default"].findOne({
        _id: payload.user.id
      }, function (err, user) {
        if (err) {
          status = 400;
          result.status = status;
          result.error = "Bad request!";
          res.status(status).send(result);
        } else if (!user) {
          status = 404;
          result.status = status;
          result.error = "User not found!";
          res.status(status).send(result);
        } else {
          // If the user exists, find the note belonging to that user
          if (payload && payload.user.role === "Admin" || payload && payload.user.id === user.id) {
            _note["default"].findOneAndRemove({
              id: id
            }, function (err, note) {
              if (err) {
                status = 400;
                result.status = status;
                result.error = "Something went wrong";
                res.status(status).send(result);
              } else if (!note) {
                status = 404;
                result.status = status;
                result.error = "Note does not exist!";
                res.status(status).send(result);
              } else {
                status = 200;
                result.status = status;
                result.message = "Successfully deleted note!";
                res.status(status).send(result);
              }
            });
          }
        }
      });
    } else {
      status = 400;
      result.status = status;
      result.error = "Bad request";
      res.status(status).send(result);
    }
  }); // Delete ALL notes

  route["delete"]("/all", _jwtHandling["default"], function (req, res) {
    var payload = req.decoded;
    status = 200;
    result = {};

    if (payload && payload.user.role === "Admin") {
      try {
        // Check if there are any notes
        _note["default"].find({},
        /*#__PURE__*/
        function () {
          var _ref = _asyncToGenerator(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee(err, notes) {
            var deletedAllNotes;
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    if (!err) {
                      _context.next = 6;
                      break;
                    }

                    status = 400;
                    result.status = status;
                    result.error = "Something went wrong: ".concat(err);
                    _context.next = 16;
                    break;

                  case 6:
                    if (!(!notes || notes.length < 1)) {
                      _context.next = 12;
                      break;
                    }

                    status = 404;
                    result.status = status;
                    result.error = "No notes found!";
                    _context.next = 16;
                    break;

                  case 12:
                    _context.next = 14;
                    return _note["default"].deleteMany({}, {
                      w: 'majority',
                      wtimeout: 250
                    });

                  case 14:
                    deletedAllNotes = _context.sent;

                    if (deletedAllNotes.ok === 1) {
                      status = 200;
                      result.status = status;
                      result.message = "Successfully deleted all notes!";
                    } else {
                      status = 400;
                      result.status = status;
                      result.error = "Could not delete all notes!";
                    }

                  case 16:
                    // Send the response back
                    res.status(status).send(result);

                  case 17:
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
      } catch (err) {
        status = 500;
        result.status = status;
        result.error = "Something went wrong! ".concat(err);
      }
    } else {
      status = 401;
      result.status = status;
      result.error = "Not authorized";
      res.status(status).send(result);
    }
  });
};

var _default = NotesRoute;
exports["default"] = _default;