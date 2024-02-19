import * as vscode from 'vscode';
import { instanceTemplate } from './commandHandlers/instanceTemplate';

const { commands } = vscode;

export function activate(context: vscode.ExtensionContext) {
  // Command: Instance Phi Template
  context.subscriptions.push(
    commands.registerCommand('phitemplater.instanceTemplate', instanceTemplate)
  );
}

export function deactivate() {}
