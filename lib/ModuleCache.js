"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _assign2 = _interopRequireDefault(require("lodash/assign"));

var _map2 = _interopRequireDefault(require("lodash/map"));

var _each2 = _interopRequireDefault(require("lodash/each"));

var _startsWith2 = _interopRequireDefault(require("lodash/startsWith"));

var _orderBy2 = _interopRequireDefault(require("lodash/orderBy"));

var _toString2 = _interopRequireDefault(require("lodash/toString"));

var _fs = _interopRequireDefault(require("fs"));

var _glob = _interopRequireDefault(require("glob"));

var _MapCache2 = _interopRequireDefault(require("./MapCache"));

var _module = _interopRequireDefault(require("module"));

var _util = require("./util");

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*----------------------------------------------------------------------------*/
var ModuleCache =
/*#__PURE__*/
function (_MapCache) {
  _inherits(ModuleCache, _MapCache);

  function ModuleCache(moduleRoot) {
    var _this;

    _classCallCheck(this, ModuleCache);

    _this = _possibleConstructorReturn(this, (ModuleCache.__proto__ || Object.getPrototypeOf(ModuleCache)).call(this));
    moduleRoot = (0, _toString2.default)(moduleRoot);

    if (!moduleRoot) {
      return _possibleConstructorReturn(_this);
    }

    var pkgPath = _path.default.join(moduleRoot, 'package.json');

    var pkgMain = _fs.default.existsSync(pkgPath) && require(pkgPath).main || 'index.js';
    var mainPath = (0, _util.normalizePath)(_path.default.dirname(_path.default.resolve(moduleRoot, pkgMain))); // Sort paths by the “main” entry first.

    var dirPaths = (0, _orderBy2.default)(_glob.default.sync(_path.default.join(moduleRoot, '**/'), {
      'ignore': _path.default.join(moduleRoot, 'node_modules/**/')
    }), function (dirPath) {
      return (0, _startsWith2.default)(dirPath, mainPath);
    }, ['desc']);
    (0, _each2.default)(dirPaths, function (dirPath) {
      var base = _path.default.relative(moduleRoot, dirPath);

      var filePaths = _glob.default.sync(_path.default.join(dirPath, '*.js'));

      var pairs = (0, _map2.default)(filePaths, function (filePath) {
        var name = _path.default.basename(filePath, '.js');

        return [name.toLowerCase(), name];
      });

      _this.set(base, new _MapCache2.default(pairs));
    });
    return _this;
  }

  _createClass(ModuleCache, null, [{
    key: "resolve",
    value: function resolve(id) {
      var from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : process.cwd();

      try {
        var dirs = _path.default.dirname(_module.default._resolveFilename(id, (0, _assign2.default)(new _module.default(), {
          'paths': _module.default._nodeModulePaths(from)
        }))).split(_path.default.sep);

        var length = dirs.length;

        while (length--) {
          var dirSub = dirs.slice(0, length + 1);
          var dirPath = dirSub.join('/');

          var pkgPath = _path.default.join(dirPath, 'package.json');

          if (length && dirs[length - 1] == 'node_modules' || _fs.default.existsSync(pkgPath) && require(pkgPath).name == id) {
            return dirPath;
          }
        }

        return dirs.join('/');
      } catch (e) {}

      return '';
    }
  }]);

  return ModuleCache;
}(_MapCache2.default);

exports.default = ModuleCache;
;
module.exports = exports["default"];