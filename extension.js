// @ts-nocheck
const vscode = require("vscode");
const cssValidator = require("csstree-validator");
const editor = vscode.window.activeTextEditor;

function activate(context) {
   const minSort = vscode.commands.registerCommand("sort-it.min", () => {
      const cssProperties = editor.document.getText(editor.selection);

      if (!editor) {
         vscode.window.showInformationMessage("Editor does not exist....");
         return;
      }

      if (cssProperties.trim().length === 0) {
         vscode.window.showInformationMessage("No Properties Selected....");
         return;
      }

      if (cssValidator.validate(`.element {${cssProperties}}`).length > 0) {
         vscode.window.showInformationMessage("Css code is invalid....");
      } else {
         editor.edit((builder) => {
            builder.replace(editor.selection, onSort("min", cssProperties));
         });
      }
   });

   const maxSort = vscode.commands.registerCommand("sort-it.max", () => {
      const cssProperties = editor.document.getText(editor.selection);

      if (!editor) {
         vscode.window.showInformationMessage("Editor does not exist....");
         return;
      }

      if (cssProperties.trim().length === 0) {
         vscode.window.showInformationMessage("No Properties Selected....");
         return;
      }

      if (cssValidator.validate(`.element {${cssProperties}}`).length > 0) {
         vscode.window.showInformationMessage("Css code is invalid....");
      } else {
         editor.edit((builder) => {
            builder.replace(editor.selection, onSort("max", cssProperties));
         });
      }
   });

   context.subscriptions.push(minSort, maxSort);
}

function onSort(format, cssProperties) {
   return cssProperties
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
}

function deactivate() {}

exports.activate = activate;

module.exports = {
   activate,
   deactivate,
};
