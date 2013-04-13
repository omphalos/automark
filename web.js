microAjax("/ngrams.json", function onOutput(res) {
  // Load the Markov Chain
  var ngrams = JSON.parse(res)
  initialize(ngrams)
});

function initialize(ngrams) {

  CodeMirror.commands.autocomplete = function(cm) {
    CodeMirror.showHint(cm, CodeMirror.javascriptHint)
  }

  var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
    lineNumbers: true,
    extraKeys: {"Ctrl-Space": "autocomplete"}
  })

  editor.on('cursorActivity', _.debounce(function cursorActivity() { 
    onEditorCursorActivity(editor, ngrams) 
  }), 100)
}

function onEditorCursorActivity(editor, ngrams) {

  var cursor       = editor.getCursor()
    , textToCursor = editor.getRange({line: 0, ch: 0}, cursor)
    , fragment     = textToCursor.substring(textToCursor.length - 100)

  var suggestions = suggest(fragment, ngrams)
  console.log(suggestions)
}

function suggest(text, ngrams) {

  var tokens = tokenize(text)

  console.log('tokens:')
  console.log(tokens)

  for(var ngramLength = tokens.length; ngramLength >= 1; ngramLength--) {

    console.log('searching for ngrams of length ' + ngramLength)

    var node = ngrams

    for(var t = 0; t < ngramLength; t++) {

      var token = tokens[t]
      node = node[token]
      if(!node) { 
        console.log('aborting search .. found matches through ' +
          tokens.slice(0, t))
        break; 
      }
    }

    if(node) {

      var suggestions = Object.
        keys(node).
        filter(function excludeCt(key) { return key !== 'ct' }).
        sort(function sorter(lhs, rhs) { return node[lhs].ct - node[rhs].ct }).
        slice(0, 5)

      return suggestions
    }
  }

  return []
}
