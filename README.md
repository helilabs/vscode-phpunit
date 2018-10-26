# vscode-phpunit README

Run individual unit test files directly from VSCode in iTerm


## Requirements

Make sure to open iterm before running any tests.

## Extension Settings
1. `missionx.vscode-phpunit.phpunitBinary`: define the path to the phpunit binary, default to empty and it will use the binary from your vendor file. This is also used to define your command entry point.
fox example if you're using **docker** to manage your development workflow, set this option to be
```json
"missionx.vscode-phpunit.phpunitBinary": "docker exec -it <contait id> -w <working directory> ./vendor/bin/phpunit"
```
2. `missionx.vscode-phpunit.commandPrefix` define a prefix to be added before the command, default to empty.
3. `missionx.vscode-phpunit.commandSuffix` define a suffix to be added after the command, default to empty.
4. `missionx.vscode-phpunit.filePath` whether to user absolute file path or relative file path, default to absolute, available options: absolute|relative
5. `missionx.vscode-phpunit.cdIntoDirectory` whether or not to cd into your project directory before executing the command.

## Known Issues

Make sure to open iterm before running any tests.

## Available Commands:
1. `vscode-phpunit.run`: Run Current Test Method
1. `vscode-phpunit.run_single`: Run Current Test File
1. `vscode-phpunit.run_tests_in_dir`: Run All Tests In Current Dir
1. `vscode-phpunit.run_all_tests`: Run All Tests(Full TestSuit)