microAjax("/output.json", function onOutput(res) {
  init(JSON.parse(res))
});

function init(model) {
  CodeMirror.commands.autocomplete = function(cm) {
    CodeMirror.showHint(cm, CodeMirror.javascriptHint);
  }
  var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
    lineNumbers: true,
    extraKeys: {"Ctrl-Space": "autocomplete"}
  });
}