;(function (root, factory) {

  // Universal Module Definition
  // https://github.com/umdjs/umd/blob/master/returnExports.js
  if (typeof exports === 'object') {
    module.exports = factory(require('./tokenizer.js'))
  } else {
    root.automark.suggest = factory(root.automark.tokenizer)
  }

}(this, function (tokenizer) {

  return function suggest(db, text) {

    var byValue              = suggestByType(db, 'value', text)
      , byGrammar            = suggestByType(db, 'grammar', text)
      , coalescedSuggestions = byValue.length ? byValue : byGrammar

    return coalescedSuggestions.map(removeBrackets)

    // Tokens are stored like '[token]'' so we have to remove the brackets.
    function removeBrackets(token) {
      return token.slice(1, token.length - 1)
    }
  }

  function suggestByType(db, type, text) {

    var result        = []
      , suggestionMap = {}
      , maxLen        = 10
      , allTokens     = tokenizer.tokenize(text, { type: type })
    
    var tokens = allTokens.length ?
      allTokens.slice(allTokens.length - maxLen) :
      ['start'] // This signifies the start of the document.

    // Check for tokenization errors.
    if(tokens.filter(identity).length !== tokens.length) {

      console.log("There was an error tokenizing:")
      console.log(tokens)
      return []
    }

    function identity(x) { return x }

    for(var ngramLength = tokens.length; ngramLength >= 1; ngramLength--) {

      // Crawl the NGramTree and try to find a matching node.
      var node = db[type]

      for(var t = 0; t < ngramLength; t++) {

        var token = tokens[tokens.length - ngramLength + t]
        node = node[token]
        if(!node)  break;
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

      // Just pick the largest matching n-gram.
      // Comment out this line if you want to include smaller n-grams.
      if(result.length) break;
    }

    // Arbitrarily limit the number of suggestions.
    return result.slice(0, 5)
  }
}))
