import * as vscode from 'vscode';
const Timers = require('./Timers');

let firstRun = true;
let cursor = {
    line: 0,
    character: 0
};



export function activate(context: vscode.ExtensionContext) {

    setInterval(Timers.logActivity, 6000); // Log activity
    Timers.logActivity();

    setInterval(Timers.checkAFK, 60000);
    Timers.checkAFK();

    setInterval(Timers.checkTimer, 10000);

    let disposable = vscode.commands.registerCommand('takeabreak.resetTimer', () => {
        Timers.timerStart = Date.now();
        vscode.window.showInformationMessage('Timer Reset.');
    });

    context.subscriptions.push(disposable);

    vscode.window.showInformationMessage('Take a break set for 30 minutes.');
    vscode.window.showInformationMessage('To reset the timer: Ctrl+Alt+G');
}


export function deactivate() { }
