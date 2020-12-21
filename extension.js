const vscode = require("vscode");

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {
   const minSort = vscode.commands.registerCommand("sort-it.min", () => {
      const editor = vscode.window.activeTextEditor;
      const cssProperties = editor.document.getText(editor.selection);

      if (!editor) {
         vscode.window.showInformationMessage("Editor does not exist....");
         return;
      }

      if (!cssProperties.trim()) {
         vscode.window.showInformationMessage("No Properties Selected....");
         return;
      }

      editor.edit((builder) => {
         builder.replace(editor.selection, onSort("min", cssProperties));
      });
   });

   const maxSort = vscode.commands.registerCommand("sort-it.max", () => {
      const editor = vscode.window.activeTextEditor;
      const cssProperties = editor.document.getText(editor.selection);

      if (!editor) {
         vscode.window.showInformationMessage("Editor does not exist....");
         return;
      }

      if (!cssProperties.trim()) {
         vscode.window.showInformationMessage("No Properties Selected....");
         return;
      }

      editor.edit((builder) => {
         builder.replace(editor.selection, onSort("max", cssProperties));
      });
   });

   context.subscriptions.push(minSort, maxSort);
}

function onSort(format, cssProperties) {
   return cssProperties
      .trim()
      .split(";")
      .filter((property) => property.toString().trim() !== "")
      .map((property) => `\t${property.toString().trim()};`)
      .sort((a, b) =>
         format === "min" ? a.length - b.length : b.length - a.length
      )
      .join("\n");
}

exports.activate = activate;

function deactivate() {}

module.exports = {
   activate,
   deactivate,
};
