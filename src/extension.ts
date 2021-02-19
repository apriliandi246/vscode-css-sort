import * as vscode from "vscode";
import { parse, generate } from "css-tree";
// @ts-ignore
import * as cssValidator from "csstree-validator";

export function activate(context: vscode.ExtensionContext) {
   const minSort = vscode.commands.registerCommand("css-sort.min", () => {
      let anotherErrors: string = "";
      const editor = vscode.window.activeTextEditor;
      const cssCode = editor?.document.getText(editor.selection).trim();

      if (!editor) {
         vscode.window.showInformationMessage("Editor does not exist");
         return;
      }

      if (!cssCode) {
         vscode.window.showWarningMessage("No CSS code selected");
         return;
      }

      parse(cssCode, {
         onParseError(error) {
            if (error.message === "Selector is expected") {
               anotherErrors = "Selector is expected";
            }

            if (error.message === "Identifier is expected") {
               anotherErrors = "Identifier is expected";
            }
         },
      });

      if (anotherErrors !== "") {
         vscode.window.showWarningMessage(anotherErrors);
         return;
      }

      if (cssCode[cssCode.length - 1] !== "}") {
         vscode.window.showWarningMessage("Right curly bracket is expected");
         return;
      }

      if (cssValidator.validate(cssCode).length > 0) {
         vscode.window.showWarningMessage(
            cssValidator.validate(cssCode)[0].message ===
               "LeftCurlyBracket is expected"
               ? "Left curly bracket is expected"
               : cssValidator.validate(cssCode)[0].message
         );
         return;
      }

      editor.edit((oldText) => {
         oldText.replace(editor.selection, onSort("min", cssCode));
      });

      editor.document.save();
   });

   const maxSort = vscode.commands.registerCommand("css-sort.max", () => {
      let anotherErrors: string = "";
      const editor = vscode.window.activeTextEditor;
      const cssCode = editor?.document.getText(editor.selection).trim();

      if (!editor) {
         vscode.window.showInformationMessage("Editor does not exist");
         return;
      }

      if (!cssCode) {
         vscode.window.showWarningMessage("No CSS code selected");
         return;
      }

      parse(cssCode, {
         onParseError(error) {
            if (error.message === "Selector is expected") {
               anotherErrors = "Selector is expected";
            }

            if (error.message === "Identifier is expected") {
               anotherErrors = "Identifier is expected";
            }
         },
      });

      if (anotherErrors !== "") {
         vscode.window.showWarningMessage(anotherErrors);
         return;
      }

      if (cssCode[cssCode.length - 1] !== "}") {
         vscode.window.showWarningMessage("Right curly bracket is expected");
         return;
      }

      if (cssValidator.validate(cssCode).length > 0) {
         vscode.window.showWarningMessage(
            cssValidator.validate(cssCode)[0].message ===
               "LeftCurlyBracket is expected"
               ? "Left curly bracket is expected"
               : cssValidator.validate(cssCode)[0].message
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
