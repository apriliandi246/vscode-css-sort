import * as vscode from "vscode";
import { parse, generate } from "css-tree";

export function activate(context: vscode.ExtensionContext) {
  const cssMinSort = vscode.commands.registerCommand("css-sort.min", () => {
    const editor = vscode.window.activeTextEditor;
    const cssCodeSelected = editor?.document.getText(editor.selection).trim();

    if (!editor) {
      vscode.window.showInformationMessage("Editor does not exist");
      return;
    }

    if (!cssCodeSelected) {
      vscode.window.showWarningMessage("No CSS code selected");
      return;
    }

    editor.edit((currentCssCode) => {
      currentCssCode.replace(
        editor.selection,
        sortCssProperties("min", cssCodeSelected)
      );
    });

    editor.document.save();
  });

  const cssMaxSort = vscode.commands.registerCommand("css-sort.max", () => {
    const editor = vscode.window.activeTextEditor;
    const cssCodeSelected = editor?.document.getText(editor.selection).trim();

    if (!editor) {
      vscode.window.showInformationMessage("Editor does not exist");
      return;
    }

    if (!cssCodeSelected) {
      vscode.window.showWarningMessage("No CSS code selected");
      return;
    }

    editor.edit((currentCssCode) => {
      currentCssCode.replace(
        editor.selection,
        sortCssProperties("max", cssCodeSelected)
      );
    });

    editor.document.save();
  });

  context.subscriptions.push(cssMinSort, cssMaxSort);
}

function sortCssProperties(pattern: string, cssCode: string): string {
  let sortedCssProperties: string = "";
  const cssAst = parse(cssCode, { parseValue: false });
  const arrCssProperties: string[] = generate(cssAst).split("}");

  // Single sort
  // Just css properties without css selector
  if (arrCssProperties[arrCssProperties.length - 1] !== "") {
    sortedCssProperties = cssCode
      .trim()
      .split("\n")
      .filter((property) => property.trim() !== "")
      .map((property) => property.trim() + ";")
      .sort((firstProperty, secondProperty) =>
        pattern === "min"
          ? firstProperty.length - secondProperty.length
          : secondProperty.length - firstProperty.length
      )
      .join("\n");
  }

  // Multiple sort
  // Can sort css properties more than one css selector with css properties
  if (arrCssProperties[arrCssProperties.length - 1] === "") {
    arrCssProperties.pop();

    for (let index = 0; index < arrCssProperties.length; index++) {
      const cssNode: string[] = arrCssProperties[index].split("{");
      const cssSelector: string = cssNode[0].trim();

      const cssProperties: string = cssNode[1]
        .trim()
        .split(";")
        .filter((property) => property.trim() !== "")
        .map((property) => property.trim() + ";")
        .sort((firstProperty, secondProperty) =>
          pattern === "min"
            ? firstProperty.length - secondProperty.length
            : secondProperty.length - firstProperty.length
        )
        .join("\n");

      sortedCssProperties += `${cssSelector} {\n ${cssProperties} \n}${
        index === arrCssProperties.length - 1 ? "\n" : "\n\n"
      }`;
    }
  }

  return sortedCssProperties;
}

export function deactivate() {}
