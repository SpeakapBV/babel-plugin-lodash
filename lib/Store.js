"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _each2 = _interopRequireDefault(require("lodash/each"));

var _MapCache2 = _interopRequireDefault(require("./MapCache"));

var _util = require("./util");

var _Package = _interopRequireDefault(require("./Package"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return _get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*----------------------------------------------------------------------------*/
var Store =
/*#__PURE__*/
function (_MapCache) {
  _inherits(Store, _MapCache);

  function Store(pkgPaths) {
    var _this;

    _classCallCheck(this, Store);

    _this = _possibleConstructorReturn(this, (Store.__proto__ || Object.getPrototypeOf(Store)).call(this));
    (0, _each2.default)(pkgPaths, function (pkgPath) {
      return _this.set(pkgPath);
    });
    return _this;
  }

  _createClass(Store, [{
    key: "get",
    value: function get(pkgPath) {
      return _get(Store.prototype.__proto__ || Object.getPrototypeOf(Store.prototype), "get", this).call(this, (0, _util.normalizePath)(pkgPath));
    }
  }, {
    key: "set",
    value: function set(pkgPath) {
      var pkgStore = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new _Package.default((0, _util.normalizePath)(pkgPath));
      return _get(Store.prototype.__proto__ || Object.getPrototypeOf(Store.prototype), "set", this).call(this, (0, _util.normalizePath)(pkgPath), pkgStore);
    }
  }]);

  return Store;
}(_MapCache2.default);

exports.default = Store;
module.exports = exports["default"];