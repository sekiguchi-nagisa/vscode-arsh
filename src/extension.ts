import * as path from 'path';
import { ExtensionContext, window as Window } from 'vscode';
import { LanguageClient, LanguageClientOptions, RevealOutputChannelOn, ServerOptions, TransportKind } from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: ExtensionContext) {
    let serverOptions = {
        command: "ydshd",
        args: [
            "--language-server" //FIXME:
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
  
  