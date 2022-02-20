const vscode = require("vscode");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  /* Clean text command */
  let disposable = vscode.commands.registerCommand(
    "cleanstr.clean",
    function () {
      // get selected text
      let editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }
      let selection = editor.selection;
      let text = editor.document.getText(selection);

      /* cleaning text */

      // remove all line breaks
      text = text.replace(/\r?\n|\r/g, " ");

      // remove all double spaces
      text = text.replace(/\s\s+/g, " ");

      // remove all spaces at the beginning and the end of the string
      text = text.trim();

      /* replacing selection */
      editor.edit(function (edit) {
        edit.replace(selection, text);
      });
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
