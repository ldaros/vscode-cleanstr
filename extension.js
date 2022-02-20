const vscode = require("vscode");
const asciiTables = require("./ascii-tables");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  /* Clean selection */
  let cleanText = vscode.commands.registerCommand("cleanstr.clean", () => {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    let text = editor.document.getText(editor.selection);

    /* cleaning text */
    text = text.replace(/\r?\n|\r/g, " ");
    text = text.replace(/\s\s+/g, " ");
    text = text.trim();

    /* replacing selection */
    editor.edit(function (edit) {
      edit.replace(editor.selection, text);
    });
  });

  /* Clean selection, preserve newline */
  let cleanPreserve = vscode.commands.registerCommand(
    "cleanstr.cleanPreserve",
    () => {
      let editor = vscode.window.activeTextEditor;
      if (!editor) return;

      let text = editor.document.getText(editor.selection);
      text = text.replace(/\s\s+/g, " ");
      text = text.trim();

      editor.edit(function (edit) {
        edit.replace(editor.selection, text);
      });
    }
  );

  /* Create table command (unicode) */
  let tableUnicode = vscode.commands.registerCommand(
    "cleanstr.tableUnicode",
    () => {
      let editor = vscode.window.activeTextEditor;
      if (!editor) return;

      let text = editor.document.getText(editor.selection);
      let table = asciiTables.createTable(text, "unicode_single_line");

      editor.edit(function (edit) {
        edit.replace(editor.selection, table);
      });
    }
  );

  /* Create table command (ascii) */
  let tableAscii = vscode.commands.registerCommand(
    "cleanstr.tableAscii",
    () => {
      let editor = vscode.window.activeTextEditor;
      if (!editor) return;

      let text = editor.document.getText(editor.selection);
      let table = asciiTables.createTable(text, "compact");

      editor.edit(function (edit) {
        edit.replace(editor.selection, table);
      });
    }
  );

  /* Create table command (md) */
  let tableMd = vscode.commands.registerCommand("cleanstr.tableMD", () => {
    let editor = vscode.window.activeTextEditor;
    if (!editor) return;

    let text = editor.document.getText(editor.selection);
    let table = asciiTables.createTable(text, "gfm");

    editor.edit(function (edit) {
      edit.replace(editor.selection, table);
    });
  });

  // add to context menu
  context.subscriptions.push(cleanText);
  context.subscriptions.push(cleanPreserve);
  context.subscriptions.push(tableUnicode);
  context.subscriptions.push(tableAscii);
  context.subscriptions.push(tableMd);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
