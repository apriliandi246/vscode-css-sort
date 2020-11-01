const vscode = require("vscode");

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {
   const MIN_SORT_COMMAND = "sort-it.min";
   const MAX_SORT_COMMAND = "sort-it.max";
   const editor = vscode.window.activeTextEditor;

   if (!editor) {
      vscode.window.showInformationMessage("Editor does not exist");
      return;
   }

   if (editor.document.getText(editor.selection) === "".trim()) {
      vscode.window.showInformationMessage("No Properties Selected");
      return;
   }

   context.subscriptions.push(
      vscode.commands.registerCommand(MIN_SORT_COMMAND, () => {
         editor.edit((builder) => {
            builder.replace(editor.selection, onSort("min"));
         });
      })
   );

   context.subscriptions.push(
      vscode.commands.registerCommand(MAX_SORT_COMMAND, () => {
         editor.edit((builder) => {
            builder.replace(editor.selection, onSort("max"));
         });
      })
   );

   function onSort(sortFormat) {
      let result = editor.document
         .getText(editor.selection)
         .split(";")
         .join("\n")
         .split("\n")
         .filter((property) => property.trim() !== "")
         .map((property) => property + ";")
         .sort((a, b) =>
            sortFormat === "min"
               ? a.trim().length - b.trim().length
               : b.trim().length - a.trim().length
         )
         .join("\n");

      return result;
   }
}

exports.activate = activate;

function deactivate() {}

module.exports = {
   activate,
   deactivate,
};
