var acorn     = require('./lib/acorn.js')
  , fs        = require('fs')
  , sampleDir = './sample/'

function readSampleFile(file) {
  return fs.readFileSync(sampleDir + file)
}

var maxLength = 4
  , tree      = { root: { ct: 0 } }

tree.push = function push(node, buffer, n) {

  n = n || 0
  node.ct++
  if(n === buffer.length) return
  var token = '[' + buffer[n] + ']'
  var child = node[token] || (node[token] = { ct: 0 })
  push(child, buffer, n + 1)
}

function traverse(source) {

  var token
    , getToken = acorn.tokenize(source)
    , buffer = ['start']

  do {

    var token = getToken()
    buffer.push(token.value || token.type.type) // add at end
    if(buffer.length === maxLength) buffer.splice(0, 1) // remove from start
    tree.push(tree.root, buffer)
  } while(token.type.type !== 'eof')
}

function prune(node, minCount) {

  var pruned = {}

  Object.
    keys(node).
    filter(function filterFn(key) { return key === 'ct' || node[key].ct >= minCount }).
    sort(function sortFn(lhs, rhs) { return node[rhs].ct - node[lhs].ct }).
    forEach(function copyKey(key) { 
      pruned[key] = key === 'ct' ? 
        node.ct : 
        prune(node[key], minCount) 
    })

  return pruned
}

fs.
  readdirSync(sampleDir).
  map        (readSampleFile).
  forEach    (traverse)

var pruned = prune(tree.root, 100)

fs.writeFileSync('output.json', JSON.stringify(pruned))
