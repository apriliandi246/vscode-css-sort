const vscode = require("vscode");

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {
   const editor = vscode.window.activeTextEditor;

   if (!editor) {
      vscode.window.showInformationMessage("Editor does not exist");
      return;
   }

   if (editor.document.getText(editor.selection) === "".trim()) {
      vscode.window.showInformationMessage("No Properties Selected");
      return;
   }

   const minSort = vscode.commands.registerCommand("sort-it.min", () => {
      editor.edit((builder) => {
         builder.replace(editor.selection, onSort("min"));
      });
   });

   const maxSort = vscode.commands.registerCommand("sort-it.max", () => {
      editor.edit((builder) => {
         builder.replace(editor.selection, onSort("max"));
      });
   });

   function onSort(format) {
      let selectionText = editor.document.getText(editor.selection);

      let result = selectionText
         .split(";")
         .join("\n")
         .split("\n")
         .filter((property) => property.trim() !== "")
         .map((property) => property + ";")
         .sort((a, b) =>
            format === "min"
               ? a.trim().length - b.trim().length
               : b.trim().length - a.trim().length
         )
         .join("\n");

      return result;
   }

   context.subscriptions.push(minSort, maxSort);
}

exports.activate = activate;

function deactivate() {}

module.exports = {
   activate,
   deactivate,
};
