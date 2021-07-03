import * as vscode from 'vscode';

let firstRun = true;
let cursor = {
    line: 0,
    character: 0
};

let cursorHistory = [{ line: 0, character: 0 }];

let afk = false;
let timerOn = false;
let timerStart : number;


function checkTimer() {
    if(timerOn && Date.now() - timerStart > 1200000) {
        vscode.window.showInformationMessage('Time to take a break! Reset the timer when you get back!');
        timerStart = Date.now();
    }
}

function startTimer() {
    timerStart = Date.now();
    timerOn = true;
}

function logActivity() {
    if (!vscode.window.activeTextEditor) {
        return;
    }
    const cursor = {
        line: vscode.window.activeTextEditor.selection.active.line,
        character: vscode.window.activeTextEditor.selection.active.character
    };

    if(!afk && !timerOn) {
        startTimer();
    }

    cursorHistory.push(cursor);
}

function checkAFK() {

    console.log('Checking AFK');
    let checkL = cursorHistory[cursorHistory.length - 1].line;
    let checkC = cursorHistory[cursorHistory.length - 1].character;

    
    for (let i = cursorHistory.length - 1; i > cursorHistory.length - 10; i--) {
        if (cursorHistory[i].line !== checkL || cursorHistory[i].character !== checkC) {
            afk = false;
            return;
        }
        afk = true;
        timerOn = false;
    }

    vscode.window.showInformationMessage('You have been gone for 5 minutes. See you soon!');
}

export function activate(context: vscode.ExtensionContext) {

    setInterval(logActivity, 6000); // Log activity
    logActivity();

    setInterval(checkAFK, 60000);
    checkAFK();

    setInterval(checkTimer, 10000);

    let disposable = vscode.commands.registerCommand('takeabreak.resetTimer', () => {
        timerStart = Date.now();
        vscode.window.showInformationMessage('Timer Reset.');
    });

    context.subscriptions.push(disposable);

    vscode.window.showInformationMessage('Take a break set for 30 minutes.');
    vscode.window.showInformationMessage('To reset the timer: Ctrl+Alt+G');
}


export function deactivate() { }
