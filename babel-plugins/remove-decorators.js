module.exports = function(babel) {
  var types = babel.types;

  function getDecoratorName(decorator) {
    if (!types.isDecorator(decorator)) {
      return void 0;
    }

    if (types.isIdentifier(decorator.expression)) {
      return decorator.expression.name;
    }

    if (types.isCallExpression(decorator.expression)) {
      var args = decorator.expression.callee.arguments;

      if (types.isStringLiteral(args[0])) {
        return args[0].value;
      }

      return void 0;
    }
  }

  return {
    visitor: {
      ClassDeclaration: function(path, state) {
        var node = path.node;
        var decorators = node.decorators;

        if (!decorators) {
          return;
        }

        node.decorators = decorators.filter(function(decorator) {
          return !state.opts.includes(getDecoratorName(decorator));
        });
      }
    }
  };
};
