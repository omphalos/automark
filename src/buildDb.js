var tokenizer  = require('./tokenizer.js')
  , NGramTree  = require('./NGramTree.js')
  , fs         = require('fs')
  , sampleDir  = '../sample/'

var settings = {
  grammar: { maxLength: 6, minCount: 1 },
  value  : { maxLength: 6, minCount: 4 }
}

Object.
  keys(tokenizer.types).
  forEach(tokenizeType);

function tokenizeType(type) {

  var tree = new NGramTree()
  tree.maxLength = settings[type].maxLength

  console.log('building ngrams by ' + type)

  fs.
    readdirSync(sampleDir).
    map        (readSampleFile).
    forEach    (traverse)

  function readSampleFile(file) {
    return fs.readFileSync(sampleDir + file)
  }

  function traverse(document) {
    var tokens = tokenizer.tokenize(document, { type: type })
    return tree.traverse(tokens)
  }

  var prunedTree = prune(tree.root, settings[type].minCount)
    , json = JSON.stringify(prunedTree)

  fs.writeFileSync(
    '../db/' + type + '.js',
    '(this.db = this.db || {}).' + type + ' = ' + json)
}

function prune(node, minCount) {

  var prunedTree = {}

  Object.
    keys   (node).
    filter (outLowCountNodes).
    sort   (byDescendingCount).
    forEach(copyPropertyToPrunedTree)

  function outLowCountNodes(key) { 
    return key === 'ct' || node[key].ct >= minCount 
  }

  function byDescendingCount(lhs, rhs) {
    return node[rhs].ct - node[lhs].ct
  }

  function copyPropertyToPrunedTree(key) {
    prunedTree[key] = key === 'ct' ? 
      node[key] : 
      prune(node[key], minCount) 
  }

  return prunedTree
}