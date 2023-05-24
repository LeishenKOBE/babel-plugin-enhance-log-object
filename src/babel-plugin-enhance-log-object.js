const generate = require("@babel/generator").default
const { stringLiteral } = require('@babel/types')
const cloneDeep = require('lodash/cloneDeep')

const SKIP_KEY = '@@babel-plugin-enhance-log-objectSkip'

function generateStrNode(str) {
  const node = stringLiteral(str)
  node.skip = true
  return node
}

module.exports = function myPlugin(babel) {
  const { types: t } = babel;

  return {
    name: 'babel-plugin-enhance-log-object',
    visitor: {
      CallExpression(path) {
        const calleeCode = generate(path.node.callee).code
        if (calleeCode === 'console.log') {
          const { trailingComments } = path.node

          const shouldSkip = (trailingComments || []).some((item) => {
            return item.type === 'CommentBlock' && item.value === SKIP_KEY
          })
          if (shouldSkip) {
            return
          }
          t.addComment(path.node, 'trailing', SKIP_KEY)
          const nodeArguments = path.node.arguments
          for (let i = 0; i < nodeArguments.length; i += 1) {
            const argument = nodeArguments[i]
            if (argument.skip)
              continue
            // 字面量类型
            if (t.isLiteral(argument)) {
              if (typeof (argument.value) === 'object' && argument.value !== null) {
                const node = generateStrNode(cloneDeep(argument.value))
                nodeArguments.splice(i, 1, node)
              }
            } else {
              const node = cloneDeep(argument)
              nodeArguments.splice(i, 1, node)
            }
          }
        }
      }
    }
  };
};