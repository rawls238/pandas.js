'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.round10 = exports.parseIndex = exports.intersectingColumns = exports.nonMergeColumns = exports.sum = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

exports.enumerate = enumerate;

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _exceptions = require('./exceptions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = [enumerate].map(_regenerator2.default.mark);

/**
 * Calculate the sum of values in an iterable
 *
 * @param {Iterable} iterable
 */
var sum = exports.sum = function sum(iterable) {
  return iterable.reduce(function (s, v) {
    return s + v;
  }, 0);
};

/**
 * enumerate an iterable
 * Inspired by: http://stackoverflow.com/a/10179849
 *
 * @param iterable
 */
function enumerate(iterable) {
  var i, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, x;

  return _regenerator2.default.wrap(function enumerate$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          i = 0;
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 4;
          _iterator = iterable[Symbol.iterator]();

        case 6:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 14;
            break;
          }

          x = _step.value;
          _context.next = 10;
          return [x, i];

        case 10:
          i += 1;

        case 11:
          _iteratorNormalCompletion = true;
          _context.next = 6;
          break;

        case 14:
          _context.next = 20;
          break;

        case 16:
          _context.prev = 16;
          _context.t0 = _context['catch'](4);
          _didIteratorError = true;
          _iteratorError = _context.t0;

        case 20:
          _context.prev = 20;
          _context.prev = 21;

          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }

        case 23:
          _context.prev = 23;

          if (!_didIteratorError) {
            _context.next = 26;
            break;
          }

          throw _iteratorError;

        case 26:
          return _context.finish(23);

        case 27:
          return _context.finish(20);

        case 28:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked[0], this, [[4, 16, 20, 28], [21,, 23, 27]]);
}

// Merge utils
/**
 * Columns in DataFrame that will not be used as merge keys
 *
 * @param {Array<string>} columns
 * @param {Array<string>} on
 * @returns {Array<string>}
 */
var nonMergeColumns = exports.nonMergeColumns = function nonMergeColumns(columns, on) {
  return columns.filter(function (k) {
    return on.indexOf(k) < 0;
  });
};

/**
 * Columns appearing in both
 *
 * @param {Array<string>} cols1
 * @param {Array<string>} cols2
 * @returns {Array<string>}
 */
var intersectingColumns = exports.intersectingColumns = function intersectingColumns(cols1, cols2) {
  return cols1.filter(function (k) {
    return cols2.indexOf(k) >= 0;
  });
};

/**
 *
 * @param {Array|List|string|number} index
 *    Values to update the index in the Series
 * @param {List} values
 *    The values in the Series
 *
 * @returns {List}
 */
var parseIndex = exports.parseIndex = function parseIndex(index, values) {
  if (Array.isArray(index)) {
    if (values.size !== index.length) throw new _exceptions.IndexMismatchError();

    return _immutable2.default.List(index);
  } else if (index instanceof _immutable2.default.List) {
    if (values.size !== index.size) throw new _exceptions.IndexMismatchError();

    return index;
  } else if (typeof index !== 'undefined') {
    if (values.size !== 1) throw new _exceptions.IndexMismatchError();

    return _immutable2.default.List([index]);
  } else if (typeof index === 'undefined') {
    return _immutable2.default.Range(0, values.size).toList();
  } else {
    throw new _exceptions.IndexMismatchError();
  }
};

/**
 * Adjust the decimal value for round, floor, or ceiling
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
 *
 * @param type
 * @param value
 * @param exp
 * @returns {*}
 */
var decimalAdjust = function decimalAdjust(type, value, exp) {
  // If the exp is undefined or zero...
  if (typeof exp === 'undefined' || +exp === 0) {
    return Math[type](value);
  }
  // noinspection Eslint
  value = +value;
  // noinspection Eslint
  exp = +exp;
  // If the value is not a number or the exp is not an integer...
  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
    return NaN;
  }
  // Shift
  // noinspection Eslint
  value = value.toString().split('e');
  // noinspection Eslint
  value = Math[type](+(value[0] + 'e' + (value[1] ? +value[1] - exp : -exp)));
  // Shift back
  // noinspection Eslint
  value = value.toString().split('e');
  // noinspection Eslint
  return +(value[0] + 'e' + (value[1] ? +value[1] + exp : exp));
};

/**
 * Round the value to the nearest power of 10
 *
 * @param {number} value
 * @param {number} exp
 * @returns {number}
 *
 * @example
 * // Returns 1.65
 * round10(1.65234123415, -2);
 */
var round10 = exports.round10 = function round10(value, exp) {
  return decimalAdjust('round', value, exp);
};
