/*

    Port of my atom version, using the cerebral-cli-generator.
    Thanks to @eByte23 for his vscode port of the original atom version.

*/

const vscode = require('vscode');
const generator = require('cerebral-cli-generator');

exports.activate = function activate(context) {
    let disposable = vscode.commands.registerCommand(
        'cerebral-signal-helper.executeOnCurrentFile',
        function() {
            if (vscode.window.activeTextEditor === undefined) {
                vscode.window.showWarningMessage('No active file open');
                return;
            }

            const editor = vscode.window.activeTextEditor;
            const document = editor.document;

            const fileContent = document.getText();
            const filePath = document.fileName;

            const result = generator.performOnFile({
                filePath: filePath,
                write: false,
                logger: console,
                content: fileContent
            });

            if (!result) {
                vscode.window.showInformationMessage(
                    'Not a valid cerebral signal file.'
                );
                return;
            }

            editor.edit(builder => {
                const document = editor.document;
                const lastLine = document.lineAt(document.lineCount - 2);

                const start = new vscode.Position(0, 0);
                const end = new vscode.Position(
                    document.lineCount - 1,
                    lastLine.text.length
                );

                builder.replace(new vscode.Range(start, end), result);
            });
        }
    );

    context.subscriptions.push(disposable);
};

exports.deactivate = function deactivate() {};
