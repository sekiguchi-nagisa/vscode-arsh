import * as path from 'path';
import { ExtensionContext, window, window as Window, workspace } from 'vscode';
import { LanguageClient, LanguageClientOptions, RevealOutputChannelOn, ServerOptions, TransportKind } from 'vscode-languageclient/node';

let client: LanguageClient;

function getExecutablePath() : string {
    var value : string = workspace.getConfiguration("analyzer").get("executablePath")
    if (value == null || value == '') {
        value = "ydshd"
    }
    return value
}

function getLogLevel() : string {
    var value : string = workspace.getConfiguration("analyzer").get("logLevel")
    if (value == null || value == '') {
        value = "warning"
    }
    return value
}

export function activate(context: ExtensionContext) {
    let serverOptions = {
        command: getExecutablePath(),
        args: [
            "--log",
            getLogLevel(),
            "--language-server",
        ]
    };
    let clientOptions = {
        documentSelector: [
            {
                scheme: "file",
                language: "ydsh",
            }
        ],
    };

    try {
        client = new LanguageClient('vscode-ydsh', 'vscode-ydsh', serverOptions, clientOptions)
        context.subscriptions.push(client.start());
    } catch(e) {
        Window.showErrorMessage(`The extension couldn't be started. See the output channel for details.`);
        return;
    }
}

export function deactivate(): Thenable<void> | undefined {
    if (!client) {
      return undefined;
    }
    return client.stop();
  }
  
  