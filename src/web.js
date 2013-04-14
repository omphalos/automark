function provideAutocompletions(editor) {
  console.log((new Date() * 1)  + '****************************************')

  var cursor       = editor.getCursor()
    , textToCursor = editor.getRange({line: 0, ch: 0}, cursor)

  var suggestions = suggest(db, textToCursor)

  return {
    list: suggestions,
    from: cursor,
    to  : cursor
  }
}

CodeMirror.commands.autocomplete = function(cm) {
  CodeMirror.showHint(cm, provideAutocompletions)
}

var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
  lineNumbers: true,
  extraKeys: {"Ctrl-Space": "autocomplete"}
})

function suggest(db, text) {

  var suggestionsByValue = suggestByType(db, 'value', text)
  console.log('suggestions by value:')
  console.log(suggestionsByValue)

  var suggestionsByGrammar = suggestByType(db, 'grammar', text)
  console.log('suggestions by grammar:')
  console.log(suggestionsByGrammar)

  var coalesced = suggestionsByValue.length ? 
    suggestionsByValue : 
    suggestionsByGrammar

  return coalesced.map(removeBrackets)

  function removeBrackets(token) {
    return token.slice(1, token.length - 1)
  }
}

function suggestByType(db, type, text) {

  var maxNgramLength = 10
    , allTokens      = tokenizer.tokenize(text, { type: type })
    , tokens         = allTokens.slice(allTokens.length - maxNgramLength)
    , result = []
    , suggestionMap = {}

  // Check for tokenization errors.
  if(tokens.filter(identity).length !== tokens.length) {

    console.log("There was an error tokenizing:")
    console.log(tokens)
    return []
  }

  function identity(x) { return x }

  console.log('tokens:')
  console.log(tokens)

  for(var ngramLength = tokens.length; ngramLength >= 1; ngramLength--) {

    // Crawl the NGramTree and try to find a matching node.
    var node = db[type]

    for(var t = 0; t < ngramLength; t++) {

      var token = tokens[tokens.length - ngramLength + t]
      node = node[token]
      if(!node) { 
        //console.log('aborting search .. found matches through ' +
        //  tokens.slice(0, t))
        break; 
      }
    }

    // If we don't find a match, try a smaller n-gram size.
    if(!node) continue

    // If we've found a node, compile suggestions from that node
    var suggestions = Object.
      keys   (node).
      filter (outCountKey).
      sort   (byCountDescending).
      forEach(addIfAbsent)

    function outCountKey(key) {
      return key !== 'ct'
    }

    function byCountDescending(lhs, rhs) { 
      return node[rhs].ct - node[lhs].ct 
    }

    function addIfAbsent(suggestion) {
      if(suggestionMap[suggestion]) return
      suggestionMap[suggestion] = 1
      result.push(suggestion)
    }

    // Just pick the largest matching n-gram
    // Comment out this line if you want to include smaller n-grams as well
    if(result.length) break;
  }

  return result.slice(0, 5)
}
