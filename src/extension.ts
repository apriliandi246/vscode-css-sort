import * as vscode from "vscode";
import { parse, generate } from "css-tree";

// @ts-ignore
import * as cssValidator from "csstree-validator";

export function activate(context: vscode.ExtensionContext) {
	const minSort = vscode.commands.registerCommand("css-sort.min", () => {
		const editor = vscode.window.activeTextEditor;
		const cssCode = editor?.document.getText(editor.selection);

		if (!editor) {
			vscode.window.showInformationMessage("Editor does not exist....");
			return;
		}

		if (!cssCode?.trim()) {
			vscode.window.showInformationMessage("No CSS code selected....");
			return;
		}

		if (cssValidator.validate(cssCode).length > 0) {
			vscode.window.showErrorMessage("Css code is invalid....");
			return;
		}

		editor.edit((oldText) =>
			oldText.replace(editor.selection, onSort("min", cssCode))
		);

		editor.document.save();
	});

	const maxSort = vscode.commands.registerCommand("css-sort.max", () => {
		const editor = vscode.window.activeTextEditor;
		const cssCode = editor?.document.getText(editor.selection);

		if (!editor) {
			vscode.window.showInformationMessage("Editor does not exist....");
			return;
		}

		if (!cssCode?.trim()) {
			vscode.window.showInformationMessage("No CSS code selected....");
			return;
		}

		if (cssValidator.validate(cssCode).length > 0) {
			vscode.window.showErrorMessage("Css code is invalid....");
			return;
		}

		editor.edit((oldText) =>
			oldText.replace(editor.selection, onSort("max", cssCode))
		);

		editor.document.save();
	});

	context.subscriptions.push(minSort, maxSort);
}

function onSort(format: string, cssCode: string) {
	let finalResult = "";
	const ast = parse(cssCode);
	const result = generate(ast).split("}");

	result.pop();

	for (let index = 0; index < result.length; index++) {
		const cssNode = result[index].split("{");
		const cssSelector = cssNode[0].trim();

		const cssProperties = cssNode[1]
			.trim()
			.split(";")
			.filter((property) => property.trim() !== "")
			.map((property) => property.trim() + ";")
			.sort((a, b) =>
				format === "min" ? a.length - b.length : b.length - a.length
			)
			.join("\n");

		finalResult += `${cssSelector} {\n ${cssProperties} \n}${index === result.length - 1 ? "\n" : "\n\n"
			}`;
	}

	return finalResult;
}

export function deactivate() { }
