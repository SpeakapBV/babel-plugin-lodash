"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _constant2 = _interopRequireDefault(require("lodash/constant"));

var _toString2 = _interopRequireDefault(require("lodash/toString"));

var _requirePackageName = _interopRequireDefault(require("require-package-name"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var reLodash = /^lodash(?:-compat|-es)?$/;
/*----------------------------------------------------------------------------*/

var Package = function Package(pkgPath) {
  _classCallCheck(this, Package);

  pkgPath = (0, _toString2.default)(pkgPath);
  var pkgName = (0, _requirePackageName.default)(pkgPath);
  this.base = pkgPath.replace(new RegExp(pkgName + '/?'), '');
  this.id = pkgName;
  this.isLodash = (0, _constant2.default)(reLodash.test(this.id));
  this.path = pkgPath;
};

exports.default = Package;
module.exports = exports["default"];