"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = lodash;

var _get2 = _interopRequireDefault(require("lodash/get"));

var _sortBy2 = _interopRequireDefault(require("lodash/sortBy"));

var _each2 = _interopRequireDefault(require("lodash/each"));

var _assign3 = _interopRequireDefault(require("lodash/assign"));

var _types = require("@babel/types");

var _config = _interopRequireDefault(require("./config"));

var _importModule3 = _interopRequireDefault(require("./importModule"));

var _resolveChainCall = _interopRequireDefault(require("./resolveChainCall"));

var _mapping = _interopRequireDefault(require("./mapping"));

var _Store = _interopRequireDefault(require("./Store"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** The error message used when implicit chain sequences are detected. */
var IMPLICIT_CHAIN_ERROR = ['Implicit Lodash chain sequences are not supported by babel-plugin-lodash.', 'Consider substituting chain sequences with composition patterns.', 'See https://medium.com/making-internets/why-using-chain-is-a-mistake-9bc1f80d51ba'].join('\n');
/*----------------------------------------------------------------------------*/

function lodash(_ref) {
  var types = _ref.types;
  var identifiers = {
    'PLACEHOLDER': types.identifier('placeholder'),
    'UNDEFINED': types.identifier('undefined')
    /**
     * Used to track variables built during the AST pass. We instantiate these in
     * the `Program` visitor in order to support running the plugin in watch mode
     * or on multiple files.
     *
     * @type Store
     */

  };
  var store = new _Store.default();

  function getCallee(_ref2) {
    var parentPath = _ref2.parentPath;

    // Trace curried calls to their origin, e.g. `fp.partial(func)([fp, 2])(1)`.
    while (!parentPath.isStatement()) {
      if (parentPath.isCallExpression()) {
        var result = parentPath.node.callee;

        while (types.isCallExpression(result)) {
          result = result.callee;
        }

        return result;
      }

      parentPath = parentPath.parentPath;
    }
  }
  /*--------------------------------------------------------------------------*/


  var visitor = {
    Program(path, state) {
      var _assign2 = (0, _assign3.default)(_mapping.default, (0, _config.default)(state.opts)),
          ids = _assign2.ids;

      var file = path.hub.file; // Clear tracked method imports.

      _importModule3.default.cache.clear();

      store.clear(); // Populate module paths per package.

      (0, _each2.default)(ids, function (id) {
        store.set(id);

        _mapping.default.modules.get(id).forEach(function (value, key) {
          store.set(id + '/' + key);
        });
      });
      var imports = [];
      var isModule = false;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = file.ast.program.body[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _node = _step.value;

          if ((0, _types.isModuleDeclaration)(_node)) {
            isModule = true;
            break;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      if (isModule) {
        file.path.traverse({
          ImportDeclaration: {
            exit(path) {
              var node = path.node;
              var imported = [];
              var specifiers = [];
              imports.push({
                source: node.source.value,
                imported,
                specifiers
              });
              var _iteratorNormalCompletion2 = true;
              var _didIteratorError2 = false;
              var _iteratorError2 = undefined;

              try {
                for (var _iterator2 = path.get("specifiers")[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                  var _specifier = _step2.value;
                  var local = _specifier.node.local.name;

                  if (_specifier.isImportDefaultSpecifier()) {
                    imported.push("default");
                    specifiers.push({
                      kind: "named",
                      imported: "default",
                      local
                    });
                  }

                  if (_specifier.isImportSpecifier()) {
                    var importedName = _specifier.node.imported.name;
                    imported.push(importedName);
                    specifiers.push({
                      kind: "named",
                      imported: importedName,
                      local
                    });
                  }

                  if (_specifier.isImportNamespaceSpecifier()) {
                    imported.push("*");
                    specifiers.push({
                      kind: "namespace",
                      local
                    });
                  }
                }
              } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                    _iterator2.return();
                  }
                } finally {
                  if (_didIteratorError2) {
                    throw _iteratorError2;
                  }
                }
              }
            }

          }
        });
      } // Replace old members with their method imports.


      (0, _each2.default)(imports, function (module) {
        var pkgStore = store.get(module.source);

        if (!pkgStore) {
          return;
        }

        var isLodash = pkgStore.isLodash();
        var specs = (0, _sortBy2.default)(module.specifiers, function (spec) {
          return spec.imported === 'default';
        });
        (0, _each2.default)(specs, function (spec) {
          var imported = spec.imported,
              local = spec.local;
          var binding = file.scope.getBinding(local); // Skip type annotation imports.

          if (!binding) {
            return false;
          }

          var isChain = isLodash && imported === 'chain';
          (0, _each2.default)(binding.referencePaths, function (refPath) {
            var node = refPath.node,
                parentPath = refPath.parentPath;
            var type = node.type;

            if (imported && imported !== 'default') {
              if (isLodash && imported === 'chain' && parentPath.isCallExpression()) {
                (0, _resolveChainCall.default)(pkgStore, parentPath);
              } else {
                var _importModule = (0, _importModule3.default)(pkgStore, imported, refPath),
                    name = _importModule.name;

                refPath.replaceWith({
                  type,
                  name
                });
              }
            } else if (parentPath.isMemberExpression()) {
              var key = refPath.parent.property.name;

              if (isLodash && key === 'chain' && parentPath.parentPath.isCallExpression()) {
                (0, _resolveChainCall.default)(pkgStore, parentPath.parentPath);
              } else {
                var _importModule2 = (0, _importModule3.default)(pkgStore, key, refPath),
                    _name = _importModule2.name;

                parentPath.replaceWith({
                  type,
                  name: _name
                });
              }
            } else if (isLodash) {
              var callee = getCallee(refPath);

              if (callee && callee.name === local) {
                throw refPath.buildCodeFrameError(IMPLICIT_CHAIN_ERROR);
              }

              refPath.replaceWith(callee ? types.memberExpression(callee, identifiers.PLACEHOLDER) : identifiers.UNDEFINED);
            }
          });
        });
      });
    },

    ImportDeclaration(path) {
      if (store.get(path.node.source.value)) {
        // Remove old import.
        path.remove();
      }
    },

    ExportNamedDeclaration(path) {
      var node = path.node;
      var pkgPath = (0, _get2.default)(node, 'source.value');
      var pkgStore = store.get(pkgPath);

      if (!pkgStore) {
        return;
      }

      node.source = null;
      (0, _each2.default)(node.specifiers, function (spec) {
        spec.local = (0, _importModule3.default)(pkgStore, spec.local.name, path);
      });
    }

  };
  return {
    visitor
  };
}

module.exports = exports["default"];