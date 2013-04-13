var tokenizer  = require('./tokenizer.js')
  , NGramTree  = require('./NGramTree.js')
  , fs         = require('fs')
  , sampleDir  = './sample/'
  , ngramDepth = 2

Object.
  keys(tokenizer.types).
  forEach(tokenizeType);

function tokenizeType(type) {

  var tree = new NGramTree()

  console.log('building ngrams by ' + type)

  fs.
    readdirSync(sampleDir).
    map(readSampleFile).
    forEach(doTypedTraversal)

  function readSampleFile(file) {
    return fs.readFileSync(sampleDir + file)
  }

  function doTypedTraversal(document) {
    return tree.traverse(document, type)
  }

  var prunedTree = prune(tree.root, ngramDepth)

  fs.writeFileSync(
    './database/' + type + '-ngrams.json',
    JSON.stringify(prunedTree))

}

function prune(node, minCount) {

  var prunedTree = {}

  Object.
    keys   (node).
    filter (outLowCountNodes).
    sort   (byDescendingCount).
    forEach(copyKeyToPrunedTree)

  function outLowCountNodes(key) { 
    return key === 'ct' || node[key].ct >= minCount 
  }

  function byDescendingCount(lhs, rhs) {
    return node[rhs].ct - node[lhs].ct
  }

  function copyKeyToPrunedTree(key) {
    prunedTree[key] = key === 'ct' ? 
      node[key] : 
      prune(node[key], minCount) 
  }

  return prunedTree
}