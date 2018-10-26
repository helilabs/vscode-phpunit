const findUp = require('find-up');
const vscode = require('vscode');
const path = require('path');

module.exports = class PhpUnitCommand {
	constructor(options) {
		this.runFullSuite = options !== undefined ? options.runFullSuite : false;
		this.runCurrentDirectory = options !== undefined ? options.runCurrentDirectory : false;
		this.runCurrentFile = options !== undefined ? options.runCurrentFile : false;

		this.lastOutput;
	}

	get output() {
		if (this.lastOutput) {
			return this.lastOutput;
		}

		if (this.runFullSuite){
			this.lastOutput = `${this.prefix}${this.binary}${this.suffix}`;
		}else if(this.runCurrentDirectory){
			this.lastOutput = `${this.prefix}${this.binary} ${this.directory}${this.suffix}`;
		}else if(this.runCurrentFile){
			this.lastOutput = `${this.prefix}${this.binary} ${this.file}${this.suffix}`;
		}else{
			this.lastOutput = `${this.prefix}${this.binary} ${this.file} ${this.filter}${this.suffix}`;
		}

		if(vscode.workspace.getConfiguration('missionx.vscode-phpunit').get('cdIntoDirectory')){
			this.lastOutput = `cd ${this.subDirectory} && ${this.lastOutput}`;
		}

		return this.lastOutput;
	}

	get file() {
		if (vscode.workspace
        .getConfiguration("missionx.vscode-phpunit")
        .get("filePath") === 'absolute'){
			return this._normalizePath(vscode.window.activeTextEditor.document.fileName);
		}
		return this._normalizePath(vscode.workspace.asRelativePath(vscode.window.activeTextEditor.document.fileName));
	}

	get filter() {
		return this.method ? `--filter '/::${this.method}$/'` : '';
	}

	//get current directory
	get directory(){
		return this._normalizePath(path.dirname(vscode.window.activeTextEditor.document.fileName));
	}

	get configuration() {
		return this.subDirectory
			? ` --configuration ${this._normalizePath(path.join(this.subDirectory, 'phpunit.xml'))}`
			: '';
	}

	get suffix() {
		let suffix = vscode.workspace.getConfiguration('missionx.vscode-phpunit').get('commandSuffix');

		return suffix ? suffix : ''; // Add a space before the suffix.
	}

	get prefix() {
		let prefix = vscode.workspace.getConfiguration('missionx.vscode-phpunit').get('commandPrefix');

		return prefix ? prefix : ''; // Add a space before the suffix.
	}

	get binary() {
		if (vscode.workspace.getConfiguration('missionx.vscode-phpunit').get('phpunitBinary')) {
			return vscode.workspace.getConfiguration('missionx.vscode-phpunit').get('phpunitBinary')
		}

		return this.subDirectory
			? this._normalizePath(path.join(this.subDirectory, 'vendor', 'bin', 'phpunit'))
			: this._normalizePath(path.join(vscode.workspace.rootPath, 'vendor', 'bin', 'phpunit'));
	}

	get subDirectory() {
		// find the closest phpunit.xml file in the project (for projects with multiple "vendor/bin/phpunit"s).
		let phpunitDotXml = findUp.sync('phpunit.xml', { cwd: vscode.window.activeTextEditor.document.fileName });

		return path.dirname(phpunitDotXml);
	}

	get method() {
		let line = vscode.window.activeTextEditor.selection.active.line;
		let method;

		while (line > 0) {
			const lineText = vscode.window.activeTextEditor.document.lineAt(line).text;
			const match = lineText.match(/^\s*(?:public|private|protected)?\s*function\s*(\w+)\s*\(.*$/);
			if (match) {
				method = match[1];
				break;
			}
			line = line - 1;
		}

		return method;
	}

	_normalizePath(path) {
		return path
			.replace(/\\/g, '/') // Convert backslashes from windows paths to forward slashes, otherwise the shell will ignore them.
			.replace(/ /g, '\\ '); // Escape spaces.
	}
}