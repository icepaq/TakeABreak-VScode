import * as vscode from 'vscode';

let cursorHistory = [{ line: 0, character: 0 }];

let afk = false;
let timerOn = false;
let timerStart : number;


// If the timer is on and has been running for more than the interval, notify the user
export function checkTimer() {
    if(timerOn && Date.now() - timerStart > 1200000) {
        vscode.window.showInformationMessage('Time to take a break! Reset the timer when you get back!');
        timerStart = Date.now();
    }
}

export function startTimer() {
    timerStart = Date.now();
    timerOn = true;
}

export function logActivity() {

    // If the user is not editing a file, then we don't want to log their activity
    if (!vscode.window.activeTextEditor) {
        return;
    }

    const cursor = {
        line: vscode.window.activeTextEditor.selection.active.line,
        character: vscode.window.activeTextEditor.selection.active.character
    };

    // If the person is not afk and the timer is not on, start the timer
    if(!afk && !timerOn) {
        startTimer();
    }

    cursorHistory.push(cursor);
}


// Check if the user is AFK and if so, reset the timer.
export function checkAFK() {

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