import * as path from 'path';
import { ExtensionContext, window as Window, workspace, commands } from 'vscode';
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

let serverOptions : ServerOptions = {
    command: "",
    args: []
}
function initServerOptions() {
    serverOptions['command'] = getExecutablePath()
    serverOptions['args'] = [
        "--log",
        getLogLevel(),
        "--language-server",
    ]
}

export async function activate(context: ExtensionContext) {
    context.subscriptions.push(
        commands.registerCommand('arshd.restart', async ()=> await restart() )
    )

    initServerOptions()
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
                "arshd.fileNameCompletion",
                "arshd.semanticHighlight",
                "arshd.rename"
            ]
        }
    };

    try {
        client = new LanguageClient('vscode-arsh', 'vscode-arsh', serverOptions, clientOptions)
        await client.start()
    } catch(e) {
        Window.showErrorMessage("failed to start arsh\n" + `${e}`);
    }
}

export async function restart() {
    try {
        if(!client) {
            throw new Error("client has not initialized yet")
        }
        initServerOptions()
        await client.restart()
    } catch (e) {
        Window.showErrorMessage("failed to restart arshd\n" + `${e}`);
    }
}

export function deactivate(): Thenable<void> | undefined {
    if (!client) {
      return undefined;
    }
    return client.stop();
}