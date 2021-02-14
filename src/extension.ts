import * as vscode from "vscode";
import { parse, generate } from "css-tree";
// @ts-ignore
import * as cssValidator from "csstree-validator";

export function activate(context: vscode.ExtensionContext) {
   const minSort = vscode.commands.registerCommand("css-sort.min", () => {
      const editor = vscode.window.activeTextEditor;
      const cssCode = editor?.document.getText(editor.selection);

      if (!editor) {
         vscode.window.showInformationMessage("Editor does not exist");
         return;
      }

      if (!cssCode?.trim()) {
         vscode.window.showWarningMessage("No CSS code selected");
         return;
      }

      if (cssValidator.validate(cssCode).length > 0) {
         vscode.window.showWarningMessage(
            cssValidator.validate(cssCode)[0].message
         );
         return;
      }

      editor.edit((oldText) => {
         oldText.replace(editor.selection, onSort("min", cssCode));
      });

      editor.document.save();
   });

   const maxSort = vscode.commands.registerCommand("css-sort.max", () => {
      const editor = vscode.window.activeTextEditor;
      const cssCode = editor?.document.getText(editor.selection);

      if (!editor) {
         vscode.window.showInformationMessage("Editor does not exist");
         return;
      }

      if (!cssCode?.trim()) {
         vscode.window.showWarningMessage("No CSS code selected");
         return;
      }

      if (cssValidator.validate(cssCode).length > 0) {
         vscode.window.showWarningMessage(
            cssValidator.validate(cssCode)[0].message
         );
         return;
      }

      editor.edit((oldText) => {
         oldText.replace(editor.selection, onSort("max", cssCode));
      });

      editor.document.save();
   });

   context.subscriptions.push(minSort, maxSort);
}

function onSort(format: string, cssCode: string): string {
   let sortedCssProperties: string = "";
   const cssAst = parse(cssCode, { parseValue: false });
   const arrCssProperties: string[] = generate(cssAst).split("}");

   arrCssProperties.pop();

   for (let index = 0; index < arrCssProperties.length; index++) {
      const cssNode: string[] = arrCssProperties[index].split("{");
      const cssSelector: string = cssNode[0].trim();

      const cssProperties: string = cssNode[1]
         .trim()
         .split(";")
         .filter((property) => property.trim() !== "")
         .map((property) => property.trim() + ";")
         .sort((a, b) =>
            format === "min" ? a.length - b.length : b.length - a.length
         )
         .join("\n");

      sortedCssProperties += `${cssSelector} {\n ${cssProperties} \n}${
         index === arrCssProperties.length - 1 ? "\n" : "\n\n"
      }`;
   }

   return sortedCssProperties;
}

export function deactivate() {}
