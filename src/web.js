function provideAutocompletions(editor) {

  var db       = window.db
    , dbLoaded = db && db.value && db.grammar
    , cursor   = editor.getCursor()

  if(!dbLoaded) {
    return { list: [], from: cursor, to: cursor }
  }

  var textToCursor = editor.getRange({line: 0, ch: 0}, cursor)
    , lastChar     = textToCursor[textToCursor.length - 1]
    , endsInJsText = isJsText(lastChar)
    , suggestions  = automark.suggest(db, textToCursor).map(addSpaceIfNeeded)

  // Workaround to prevent tokens from stringing together
  function addSpaceIfNeeded(suggestion) {
    return (endsInJsText && isJsText(suggestion[0]) ? ' ' : '') + suggestion
  }

  function isJsText(char) {
    return /[_$a-zA-Z0-9\xA0-\uFFFF]/.test(char)
  }

  return {
    list: suggestions,
    from: cursor,
    to  : cursor
  }
}

CodeMirror.commands.autocomplete = function(cm) {
  CodeMirror.showHint(cm, provideAutocompletions)
}

document.getElementById('btn').onclick = function onclick() {
  CodeMirror.showHint(window.editor, provideAutocompletions)
}