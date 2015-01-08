"use strict";

var _inherits = function (child, parent) {
  child.prototype = Object.create(parent && parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (parent) child.__proto__ = parent;
};

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var fs = _interopRequire(require("fs"));

var parse = _interopRequire(require("shift-parser"));

var reduce = _interopRequire(require("shift-reducer"));

var MonoidalReducer = require("shift-reducer").MonoidalReducer;
var Lev = _interopRequire(require("levenshtein"));

module.exports = function (source) {
  var minLength = arguments[1] === undefined ? 6 : arguments[1];
  var threshold = arguments[2] === undefined ? 4 : arguments[2];
  var ast = parse(source);

  var identifiers = reduce(new IdentifierGetter(), ast);

  var identifierCount = identifiers.reduce(function (a, n) {
    a[n] = ++a[n] || 1;return a;
  }, {});

  var uniqueIdentifiers = Object.keys(identifierCount);

  var matches = findNearestMatches(uniqueIdentifiers, minLength, threshold);

  var nonEmptyMatches = Object.keys(matches).reduce(function (a, n) {
    if (matches[n].length) a[n] = matches[n];return a;
  }, {});

  return nonEmptyMatches;
};

var IdentifierGetter = (function () {
  var _MonoidalReducer = MonoidalReducer;
  var IdentifierGetter = function IdentifierGetter() {
    _MonoidalReducer.call(this, {
      empty: function () {
        return [];
      },
      concat: function (a) {
        return this.concat(a);
      }
    });
  };

  _inherits(IdentifierGetter, _MonoidalReducer);

  IdentifierGetter.prototype.reduceIdentifierExpression = function (node) {
    return [node.identifier.name];
  };

  return IdentifierGetter;
})();

function findNearestMatches(uniqueIdentifiers) {
  var minLength = arguments[1] === undefined ? 6 : arguments[1];
  var threshold = arguments[2] === undefined ? 4 : arguments[2];
  var rv = {}, copy = uniqueIdentifiers.concat(), string = undefined, compare = undefined, l = undefined;

  while (string = copy.shift()) {
    if (string.length <= minLength) continue;
    rv[string] = rv[string] || [];

    for (var j = 0; j < copy.length; j++) {
      compare = copy[j];
      l = new Lev(string, compare);
      if (l.distance < threshold) {
        rv[compare] = rv[compare] || [];
        try {
          rv[string].push(compare);
          rv[compare].push(string);
        } catch (e) {}
      }
    }
  }
  return rv;
}
// reserved word skipped;
//# sourceMappingURL=data:application/json;base64,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LEdBQUcsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDN0IsVUFBSSxDQUFDLENBQUMsUUFBUSxHQUFHLFNBQVMsRUFBRTtBQUMxQixVQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNoQyxZQUFJO0FBQ0YsWUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN6QixZQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzFCLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFFWDtPQUNGO0tBQ0Y7R0FDRjtBQUNELFNBQU8sRUFBRSxDQUFDO0NBQ1giLCJmaWxlIjoic3JjL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuXG5pbXBvcnQgcGFyc2UgZnJvbSAnc2hpZnQtcGFyc2VyJztcbmltcG9ydCByZWR1Y2UsIHsgTW9ub2lkYWxSZWR1Y2VyIH0gZnJvbSBcInNoaWZ0LXJlZHVjZXJcIjtcbmltcG9ydCBMZXYgZnJvbSBcImxldmVuc2h0ZWluXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHNvdXJjZSwgbWluTGVuZ3RoID0gNiwgdGhyZXNob2xkID0gNCkge1xuICBsZXQgYXN0ID0gcGFyc2Uoc291cmNlKTtcblxuICBsZXQgaWRlbnRpZmllcnMgPSByZWR1Y2UobmV3IElkZW50aWZpZXJHZXR0ZXIsIGFzdCk7XG5cbiAgbGV0IGlkZW50aWZpZXJDb3VudCA9IGlkZW50aWZpZXJzLnJlZHVjZSgoYSwgbikgPT4geyBhW25dID0gKythW25dIHx8IDE7IHJldHVybiBhOyB9LCB7fSk7XG5cbiAgbGV0IHVuaXF1ZUlkZW50aWZpZXJzID0gT2JqZWN0LmtleXMoaWRlbnRpZmllckNvdW50KTtcblxuICBsZXQgbWF0Y2hlcyA9IGZpbmROZWFyZXN0TWF0Y2hlcyh1bmlxdWVJZGVudGlmaWVycywgbWluTGVuZ3RoLCB0aHJlc2hvbGQpO1xuXG4gIGxldCBub25FbXB0eU1hdGNoZXMgPSBPYmplY3Qua2V5cyhtYXRjaGVzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlZHVjZSgoYSwgbikgPT4ge2lmIChtYXRjaGVzW25dLmxlbmd0aCkgYVtuXSA9IG1hdGNoZXNbbl07IHJldHVybiBhOyB9LCB7fSk7XG5cbiAgcmV0dXJuIG5vbkVtcHR5TWF0Y2hlcztcbn1cblxuXG5jbGFzcyBJZGVudGlmaWVyR2V0dGVyIGV4dGVuZHMgTW9ub2lkYWxSZWR1Y2VyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoe1xuICAgICAgZW1wdHkgOiBmdW5jdGlvbigpIHsgcmV0dXJuIFtdOyB9LFxuICAgICAgY29uY2F0IDogZnVuY3Rpb24oYSkgeyByZXR1cm4gdGhpcy5jb25jYXQoYSk7IH1cbiAgICB9KTtcbiAgfVxuXG4gIHJlZHVjZUlkZW50aWZpZXJFeHByZXNzaW9uKG5vZGUpIHtcbiAgICByZXR1cm4gWyBub2RlLmlkZW50aWZpZXIubmFtZSBdO1xuICB9XG59XG5cbmZ1bmN0aW9uIGZpbmROZWFyZXN0TWF0Y2hlcyh1bmlxdWVJZGVudGlmaWVycywgbWluTGVuZ3RoID0gNiwgdGhyZXNob2xkID0gNCkge1xuICBsZXQgcnYgPSB7fSxcbiAgICAgIGNvcHkgPSB1bmlxdWVJZGVudGlmaWVycy5jb25jYXQoKSxcbiAgICAgIHN0cmluZywgY29tcGFyZSwgbDtcblxuICB3aGlsZSAoc3RyaW5nID0gY29weS5zaGlmdCgpKSB7XG4gICAgaWYgKHN0cmluZy5sZW5ndGggPD0gbWluTGVuZ3RoKSBjb250aW51ZTtcbiAgICBydltzdHJpbmddID0gcnZbc3RyaW5nXSB8fCBbXTtcblxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29weS5sZW5ndGg7IGorKykge1xuICAgICAgY29tcGFyZSA9IGNvcHlbal07XG4gICAgICBsID0gbmV3IExldihzdHJpbmcsIGNvbXBhcmUpO1xuICAgICAgaWYgKGwuZGlzdGFuY2UgPCB0aHJlc2hvbGQpIHtcbiAgICAgICAgcnZbY29tcGFyZV0gPSBydltjb21wYXJlXSB8fCBbXTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBydltzdHJpbmddLnB1c2goY29tcGFyZSk7XG4gICAgICAgICAgcnZbY29tcGFyZV0ucHVzaChzdHJpbmcpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgLy8gcmVzZXJ2ZWQgd29yZCBza2lwcGVkO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBydjtcbn1cblxuIl19