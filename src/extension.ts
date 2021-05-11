import * as vscode from 'vscode';

let firstRun = true;
let cursor = {
	line: 0,
	character: 0
};


function checkCursor() {

	console.log('checkCursor');
	let editor = vscode.window.activeTextEditor;

	if (editor) {
		let active = editor.selection.active;
		let newCursor = {
			line: active.line,
			character: active.line
		};

		// REF INIT
		if (firstRun) {
			firstRun = false;
			cursor = newCursor;
			return;
		}

		// See if the cursor is at a new location
		if (cursor.line !== active.line && cursor.character !== active.character) {
			vscode.window.showInformationMessage('Reset the timer when you come back.');
			vscode.window.showInformationMessage('Get some exercise.');
			vscode.window.showInformationMessage('It is time to take a break.');
			
		}
		cursor = newCursor;
	}
}

export function activate(context: vscode.ExtensionContext) {

	let intervalLength = 1800000;
	let interval = setInterval(checkCursor, intervalLength); // Check activity will be called every 30 minutes
	checkCursor(); // Initialize the project. See REF INIT

	let disposable = vscode.commands.registerCommand('takeabreak.resetTimer', () => {

		clearInterval(interval);
		interval = setInterval(checkCursor, intervalLength);

		vscode.window.showInformationMessage('Timer Reset.');
	});

	context.subscriptions.push(disposable);

	vscode.window.showInformationMessage('Take a break set for 30 minutes.');
	vscode.window.showInformationMessage('To reset the timer: Ctrl+Alt+G');
}


export function deactivate() { }
