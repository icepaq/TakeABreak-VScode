import * as vscode from 'vscode';
const timers = require('./Timers');

export function activate(context: vscode.ExtensionContext) {

    console.log("Extension Activated");
    // Parse settings.json
    let interval = vscode.workspace.getConfiguration().get('takeabreak.interval');
    let afkreset = vscode.workspace.getConfiguration().get('takeabreak.afkreset');

    
    // Set the interval for the timer and start it
    if (typeof interval === 'number') {
        console.log("Setting interval for: " + interval * 60000);
        timers.setInterval(interval * 60000);

        vscode.window.showInformationMessage('Take a break set for ' + interval + ' minutes');
        vscode.window.showInformationMessage('To reset the timer: Ctrl+Alt+G');

    } else {
        console.log("Invalid interval setting");
        timers.setInterval(1800000);
    }
    
    // This looks for when you have been gone for more than the set interval
    if (typeof afkreset === 'number') {
        console.log("Setting afkreset for: " + afkreset * 60000);
        timers.setAfkReset(afkreset * 60000);
    } else {
        console.log("Invalid afkreset setting");
        timers.setAfkReset(60000);
    }

    setInterval(timers.checkTimer, 10000);
    setInterval(timers.checkAFK, 10000);
    setInterval(timers.logActivity, 10000);

    let disposable = vscode.commands.registerCommand('takeabreak.resetTimer', () => {
        timers.setTimerStart(Date.now());
        vscode.window.showInformationMessage('Timer Reset.');
    });    

    context.subscriptions.push(disposable);
}


export function deactivate() { }
