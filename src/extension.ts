import * as vscode from 'vscode';
import { instanceTemplate } from './commandHandlers/instanceTemplate';

import { TemplateInstanceData } from './deprecated-work/interfaces/templateInstanceInterfaces';

const { commands } = vscode;

export function activate(context: vscode.ExtensionContext) {
  console.log('Phi Templater activated');

  // TODO: enable this only when phiTemplater is not already configured OR window error when attempted
  // context.subscriptions.push(
  //   commands.registerCommand('phitemplater.configure', configurePhiTemplater)
  // );

  // Command: Instance Phi Template
  context.subscriptions.push(
    commands.registerCommand('phitemplater.instanceTemplate', instanceTemplate)
  );
}

// This method is called when your extension is deactivated
export function deactivate() {
  console.log('Phi Templater deactivated');
}
