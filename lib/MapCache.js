"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Map2 = _interopRequireDefault(require("./Map"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return _get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BREAK = {};
/*----------------------------------------------------------------------------*/

var MapCache =
/*#__PURE__*/
function (_Map) {
  _inherits(MapCache, _Map);

  function MapCache() {
    _classCallCheck(this, MapCache);

    return _possibleConstructorReturn(this, (MapCache.__proto__ || Object.getPrototypeOf(MapCache)).apply(this, arguments));
  }

  _createClass(MapCache, [{
    key: "clear",
    value: function clear() {
      _get(MapCache.prototype.__proto__ || Object.getPrototypeOf(MapCache.prototype), "clear", this).call(this);

      return this;
    }
  }, {
    key: "findKey",
    value: function findKey(iteratee) {
      var result;

      try {
        this.forEach(function (value, key, map) {
          if (iteratee(value, key, map)) {
            result = key;
            throw BREAK;
          }
        });
      } catch (e) {
        if (e !== BREAK) {
          throw e;
        }
      }

      return result;
    }
  }]);

  return MapCache;
}(_Map2.default);

exports.default = MapCache;
module.exports = exports["default"];