import * as path from 'path';
import { ExtensionContext, window, window as Window, workspace } from 'vscode';
import { LanguageClient, LanguageClientOptions, RevealOutputChannelOn, ServerOptions, TransportKind } from 'vscode-languageclient/node';

let client: LanguageClient;

function getExecutablePath() : string {
    var value : string = workspace.getConfiguration("arshd").get("executablePath")
    if (value == null || value == '') {
        value = "arshd"
    }
    return value
}

function getLogLevel() : string {
    var value : string = workspace.getConfiguration("arshd").get("logLevel")
    if (value == null || value == '') {
        value = "warning"
    }
    return value
}

export function activate(context: ExtensionContext) : void {
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
                language: "arsh",
            }
        ],
        synchronize: {
            configurationSection: [
                "arshd.logLevel",
                "arshd.commandCompletion",
                "arshd.commandArgumentCompletion",
                "arshd.semanticHighlight",
                "arshd.rename"
            ]
        }
    };

    try {
        client = new LanguageClient('vscode-arsh', 'vscode-arsh', serverOptions, clientOptions)
        client.start()
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
  
  