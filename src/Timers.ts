import * as vscode from 'vscode';

let cursorHistory = [{ line: 0, character: 0 }];

let afk = false;
let timerOn = false;
let timerStart : number;
let interval: number;
let afkreset: number;

export function setTimerStart (time: number) {
    timerStart = time;
}

export function setAfkReset(value: number) {
    afkreset = value;
}

export function setInterval(time: number) {
    interval = time;
}

// If the timer is on and has been running for more than the interval, notify the user
export function checkTimer() {
    console.log(timerStart);
    if(timerOn && Date.now() - timerStart > interval) {
        vscode.window.showInformationMessage('Time to take a break! Reset the timer when you get back!');
        timerStart = Date.now();
    }
}

export function startTimer() {
    timerStart = Date.now();
    timerOn = true;
}

export function logActivity() {

    // If the user is not in a file, log (0, 0)
    if (!vscode.window.activeTextEditor) {
        const cursor = {
            line: 0,
            character: 0
        };
        cursorHistory.push(cursor);
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

    // Get most recent cursor position
    let checkL = cursorHistory[cursorHistory.length - 1].line;
    let checkC = cursorHistory[cursorHistory.length - 1].character;

    // We need to make sure that there is at least 'afkreset' seconds in history
    if(cursorHistory.length < afkreset / 10000) {
        console.log('Not enough history to check afk');
        return;
    }

    // Over here, we are checking `afkreset` steps in the past. For example, if afk reset is 10000 we check 10 steps in the past.
    for (let i = cursorHistory.length - 1; i > cursorHistory.length - (afkreset / 10000); i--) {
        // If at least one of the lines is different, the user is not afk
        if (cursorHistory[i].line !== checkL || cursorHistory[i].character !== checkC) {
            afk = false;
            timerOn = true;
            console.log('Activity Found');
            return;
        }
        // Turn off the timer and set afk to true. This is used for checkTimer()
        afk = true;
        timerOn = false;
    }

    console.log('Timer has been disabled');

    vscode.window.showInformationMessage('You have been gone for 5 minutes. See you soon!');
}