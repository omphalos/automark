function provideAutocompletions(editor) {
  console.log((new Date() * 1)  + '****************************************')

  var cursor       = editor.getCursor()
    , textToCursor = editor.getRange({line: 0, ch: 0}, cursor)

  var suggestions = automark.suggest(db, textToCursor)

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