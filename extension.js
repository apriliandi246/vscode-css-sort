// @ts-nocheck
const vscode = require("vscode");
const cssValidator = require("csstree-validator");

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

      if (cssValidator.validate(`.element {${cssProperties}}`).length > 0) {
         vscode.window.showErrorMessage("Css code is invalid....");
      } else {
         const result = cssProperties
            .split(";")
            .join("\n")
            .split("\n")
            .filter((property) => property.trim() !== "")
            .map((property) => property + ";")
            .sort((a, b) => a.trim().length - b.trim().length)
            .join("\n");

         editor.edit((builder) => {
            builder.replace(editor.selection, result);
         });
      }
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

      if (cssValidator.validate(`.element {${cssProperties}}`).length > 0) {
         vscode.window.showErrorMessage("Css code is invalid....");
      } else {
         const result = cssProperties
            .split(";")
            .join("\n")
            .split("\n")
            .filter((property) => property.trim() !== "")
            .map((property) => property + ";")
            .sort((a, b) => b.trim().length - a.trim().length)
            .join("\n");

         editor.edit((builder) => {
            builder.replace(editor.selection, result);
         });
      }
   });

   context.subscriptions.push(minSort);
   context.subscriptions.push(maxSort);
}

exports.activate = activate;

module.exports = {
   activate,
};
