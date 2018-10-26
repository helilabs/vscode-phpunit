const vscode = require('vscode');
const osascript = require('node-osascript');
const PHPUNITCommand = require('./phpunit-command');

function activate(context) {
	let disposable = [];
	disposable.push(vscode.commands.registerCommand('vscode-phpunit.run', async () => {
		let command = new PHPUNITCommand ;
		await runCommand(command);
	}));

	disposable.push(vscode.commands.registerCommand('vscode-phpunit.run_single', async () => {
		let command = new PHPUNITCommand({runCurrentFile: true});
		await runCommand(command);
	}));

	disposable.push(vscode.commands.registerCommand('vscode-phpunit.run_tests_in_dir', async () => {
		let command = new PHPUNITCommand({runCurrentDirectory: true});
		await runCommand(command);
	}));

	disposable.push(vscode.commands.registerCommand('vscode-phpunit.run_all_tests', async () => {
		let command = new PHPUNITCommand({runFullSuite: true});
		await runCommand(command);
	}));

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;

async function runCommand(command){
	await runTerminalCommand(`clear`);
	await runTerminalCommand(`${command.output}`);
}

function runTerminalCommand(code){
	return new Promise(function(resolve, reject){
		let command = []
		command.push('tell application "iTerm2"');
		command.push('	tell current session of first window');
		command.push('		activate current session');
		command.push('		write text code');
		command.push('	end tell');
		command.push('end tell');
		command = command.join('\n');

		osascript.execute(command, { code: code }, function (error, result, raw) {
			console.log(code);

			if (error) {
				reject(error);
				console.error("An error occurred: ");
				console.error(error);
			}else{
				resolve('done');
			}
		});
	});
}