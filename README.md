# Take a Break
A timer extension for VSCode that reminds yo uto take breaks.

## Introduction
It's important to take periodic breaks when sitting infront of a screen for hours.

As soon as you come back reset the timer by pressing Ctrl+Alt+G. If you do not open VSCode to an existing file, reset the timer when you open one.

The timer will reset if you have been idle for 5 minutes.

## Usage
Ctrl+Alt+G resets the timer

To adjust the interval of your breaks, add the following line to your .vscode/settings.json file: 
`"takeabreak.interval": 1,` where 1 is your interval in minutes.
