(function (root, factory) {

  // Universal Module Definition
  // https://github.com/umdjs/umd/blob/master/returnExports.js
  if (typeof exports === 'object') {
    module.exports = factory(require('../lib/acorn/acorn.js'))
  } else {
    root.automark = { tokenizer: factory(root.acorn) }
  }

}(this, function (acorn) {

  function tokenize(text, options) {

    var type = (options || {}).type || 'literal'

    var tokenStringifier = typeof type === 'string'
      ? types[type]
      : type

    var tokens = []
      , getToken = acorn.tokenize(text)

    while(true) {

      var token

      try {
        token = getToken()
      } catch(err) {

        console.log(err)
        tokens.push(null)
        break;
      }

      if(token.type.type === 'eof') break;
      tokens.push('[' + tokenStringifier(token) + ']')

    }

    return tokens
  }

  var types = {

    value: function value(token) {
      return token.value || token.type.type
    },

    grammar: function grammar(token) {
      return token.type.type || token.value
    }
  }

  return {
    tokenize: tokenize,
    types: types
  }

}))
