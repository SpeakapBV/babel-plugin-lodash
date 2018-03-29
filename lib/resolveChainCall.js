"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = resolveChainCall;

var _types = require("@babel/types");

var _importModule2 = _interopRequireDefault(require("./importModule"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/** The error message used when unterminated chain sequences are detected. */
var UNTERMINATED_CHAIN_ERROR = ['Unterminated Lodash chain sequences are not supported by babel-plugin-lodash.', 'Consider substituting chain sequences with composition patterns.', 'See https://medium.com/making-internets/why-using-chain-is-a-mistake-9bc1f80d51ba'].join('\n');
/*----------------------------------------------------------------------------*/

function resolveChainCall(pkgStore, chainCallPath) {
  var nestedCallArgument = chainCallPath.node.arguments[0];
  var nextCallPath = chainCallPath;
  var nextMemberPath;
  var nextMemberName;

  while ((nextMemberPath = nextCallPath.parentPath).isMemberExpression() && (nextCallPath = nextMemberPath.parentPath).isCallExpression()) {
    nextMemberName = nextMemberPath.node.property.name;

    if (nextMemberName === 'value') {
      nextCallPath.replaceWith(nestedCallArgument);
      return;
    } else {
      var _importModule = (0, _importModule2.default)(pkgStore, nextMemberName, nextCallPath),
          name = _importModule.name;

      nestedCallArgument = (0, _types.callExpression)((0, _types.identifier)(name), [nestedCallArgument].concat(_toConsumableArray(nextCallPath.node.arguments)));
      nextMemberPath.parentPath.replaceWith(nestedCallArgument);
    }
  }

  throw nextMemberPath.buildCodeFrameError(UNTERMINATED_CHAIN_ERROR);
}

module.exports = exports["default"];