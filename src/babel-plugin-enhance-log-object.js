const generate = require("@babel/generator").default;
const { stringLiteral, In } = require("@babel/types");
const copyObj = require("./deepClone");

const SKIP_KEY = "@@babel-plugin-enhance-log-objectSkip";

function generateStrNode(str) {
  const node = stringLiteral(str);
  node.skip = true;
  return node;
}

module.exports = function myPlugin(babel) {
  const { types: t } = babel;

  return {
    name: "babel-plugin-enhance-log-object",
    visitor: {
      CallExpression(path) {
        const calleeCode = generate(path.node.callee).code;
        if (calleeCode === "console.log") {
          const { trailingComments } = path.node;
          const shouldSkip = (trailingComments || []).some((item) => {
            return item.type === "CommentBlock" && item.value === SKIP_KEY;
          });
          if (shouldSkip) {
            return;
          }
          t.addComment(path.node, "trailing", SKIP_KEY);
          const nodeArguments = path.node.arguments;
          for (let i = 0; i < nodeArguments.length; i += 1) {
            const argument = nodeArguments[i];
            if (argument.skip) continue;
            if (t.isIdentifier(argument)) {
              console.log(t.identifier(argument.name), "===");
              // const node = t.valueToNode(copyObj({ a: 1 }));
              // nodeArguments.splice(i, 1, node);
            }
          }
        }
      },
    },
  };
};
