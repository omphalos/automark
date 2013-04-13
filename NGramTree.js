var tokenizer = require('./tokenizer.js')

function NGramTree() {
  this.maxLength = 3
  this.root = { ct: 0 }
}

NGramTree.prototype.traverse = function traverse(document, tokenizeOptions) {

  var tokens = tokenizer.tokenize(document, tokenizeOptions)
    , buffer = ['start']
    , self = this

  tokens.forEach(function pushToken(token) {

    // Add token to end of buffer, but limit length.
    buffer.push(token)
    if(buffer.length === self.maxLength) buffer.splice(0, 1)

    // Push all the tokens into the tree.
    push(self.root, buffer, 0)
  })
}

function push(node, buffer, index) {

  node.ct++

  if(index === buffer.length) return

  var token = buffer[index]

  var child = 
    node[token] || 
    (node[token] = { ct: 0 }) // Create a child where there is none

  push(child, buffer, index + 1)
}

module.exports = NGramTree