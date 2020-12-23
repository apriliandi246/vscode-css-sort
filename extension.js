const vscode = require("vscode");

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {
   const minSort = vscode.commands.registerCommand("css-sort.min", () => {
      const editor = vscode.window.activeTextEditor;
      const cssCode = editor.document.getText(editor.selection);

      if (!editor) {
         vscode.window.showInformationMessage("Editor does not exist....");
         return;
      }

      if (!cssCode.trim()) {
         vscode.window.showInformationMessage("No CSS code selected....");
         return;
      }

      editor.edit((builder) =>
         builder.replace(editor.selection, onSort("min", cssCode))
      );

      editor.document.save();
   });

   const maxSort = vscode.commands.registerCommand("css-sort.max", () => {
      const editor = vscode.window.activeTextEditor;
      const cssCode = editor.document.getText(editor.selection);

      if (!editor) {
         vscode.window.showInformationMessage("Editor does not exist....");
         return;
      }

      if (!cssCode.trim()) {
         vscode.window.showInformationMessage("No CSS code selected....");
         return;
      }

      editor.edit((builder) =>
         builder.replace(editor.selection, onSort("max", cssCode))
      );

      editor.document.save();
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

   return `${cssSelector.join("").trim()} {\n ${result} \n}`.trim();
}

exports.activate = activate;

function deactivate() {}

module.exports = {
   activate,
   deactivate,
};
