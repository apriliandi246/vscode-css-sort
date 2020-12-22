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

function onSort(format, cssCode) {
   const cssSelector = cssCode.trim().split("{");
   const cssProperties = cssSelector.splice(1).join("").trim();

   const result = cssProperties
      .slice(0, cssProperties.length - 1)
      .trim()
      .split(";")
      .filter((property) => property.trim() !== "")
      .map((property) => `\t${property.trim()};`)
      .sort((a, b) =>
         format === "min"
            ? a.trim().length - b.trim().length
            : b.trim().length - a.trim().length
      )
      .join("\n");

   return `${cssSelector.join("")} {\n ${result} \n}`;
}

exports.activate = activate;

function deactivate() {}

module.exports = {
   activate,
   deactivate,
};
