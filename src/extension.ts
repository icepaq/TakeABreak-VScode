import * as vscode from 'vscode';
const timers = require('./Timers');

let firstRun = true;
let cursor = {
    line: 0,
    character: 0
};


export function activate(context: vscode.ExtensionContext) {

    console.log("Extension Activated");
    // Parse settings.json
    let interval = vscode.workspace.getConfiguration().get('takeabreak.interval');
    let afkreset = vscode.workspace.getConfiguration().get('takeabreak.afkreset');

    setInterval(timers.logActivity, 6000); // Log activity
    timers.logActivity();

    if (typeof interval === 'number') {
        console.log("Setting interval for: " + interval * 60000);
        timers.setInterval(interval * 60000);

        vscode.window.showInformationMessage('Take a break set for ' + interval + ' minutes');
        vscode.window.showInformationMessage('To reset the timer: Ctrl+Alt+G');

    } else {
        console.log("Invalid interval setting");
        timers.setInterval(1800000);
    }
    
    //timers.checkAFK();

    setInterval(timers.checkTimer, 10000);
    //setInterval(timers.checkAFK, 10000);

    let disposable = vscode.commands.registerCommand('takeabreak.resetTimer', () => {
        timers.timerStart = Date.now();
        vscode.window.showInformationMessage('Timer Reset.');
    });

    

    context.subscriptions.push(disposable);
}


export function deactivate() { }
