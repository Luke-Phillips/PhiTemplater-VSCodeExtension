import * as vscode from 'vscode';
import { TextDecoder } from 'node:util';
import {
  PhiTemplaterConfig,
  PhiTemplaterConfigTemplate,
  PhiTemplaterConfigTemplateFile,
} from './interfaces/configInterfaces';

const { commands, window, workspace } = vscode;

const isPhiTemplaterConfigured = async (
  workspaceFolder?: vscode.WorkspaceFolder
): Promise<boolean> => {
  if (!workspaceFolder) {
    return (
      (await workspace.findFiles('phiTemplater.config.json', null, 1)).length >
      0
    );
  }
  const configFilePattern = new vscode.RelativePattern(
    workspaceFolder,
    '**/phiTemplater.config.json'
  );
  return (await workspace.findFiles(configFilePattern, null, 1)).length > 0;
};

function configurePhiTemplaterForWorkspace(
  workspaceFolder: vscode.WorkspaceFolder
) {
  const workspaceFolderPath = workspaceFolder.uri.fsPath;
  const phiTemplaterConfigFileUri = vscode.Uri.file(
    workspaceFolderPath + '/phiTemplater.config.json'
  );
  const configFileEdit = new vscode.WorkspaceEdit();
  const phiTemplaterContentBuffer = Buffer.from(
    `{\n  "templatesLocation": "./phiTemplates",\n  "templates": []\n}`
  );
  configFileEdit.createFile(phiTemplaterConfigFileUri, {
    contents: phiTemplaterContentBuffer,
  });
  workspace.applyEdit(configFileEdit);
  // TODO
  //     createPhiTemplaterTemplatesFolder()
  //     open phiTemplater.config.json ???
}

async function configurePhiTemplater() {
  const workspaceFolders = workspace.workspaceFolders;
  if (workspaceFolders === undefined || workspaceFolders.length === 0) {
    window.showErrorMessage(
      'Open a workspace before configuring Phi Templater'
    );
  } else if (workspaceFolders.length === 1) {
    if (await isPhiTemplaterConfigured()) {
      window.showErrorMessage('Phi Templater is already configured');
    } else {
      configurePhiTemplaterForWorkspace(workspaceFolders[0]);
    }
  } else if (workspaceFolders.length > 1) {
    let unconfiguredWorkspaceFolders = [];
    for (const folder of workspaceFolders) {
      if (!(await isPhiTemplaterConfigured(folder))) {
        unconfiguredWorkspaceFolders.push(folder);
      }
    }
    if (unconfiguredWorkspaceFolders.length === 0) {
      window.showErrorMessage(
        'Phi Templater is already configured for all workspaces'
      );
    } else if (unconfiguredWorkspaceFolders.length === 1) {
      configurePhiTemplaterForWorkspace(unconfiguredWorkspaceFolders[0]);
    } else if (unconfiguredWorkspaceFolders.length > 1) {
      const workspaceFolderSelectorOptions = {
        title: 'Choose Workspace Folders to Configure',
        placeHolder: 'search templates',
        canPickMany: true,
      };
      const workspaceFolderNamesToConfigure =
        (await window.showQuickPick(
          unconfiguredWorkspaceFolders.map((folder) => folder.name),
          workspaceFolderSelectorOptions
        )) ?? [];
      for (const folderName of workspaceFolderNamesToConfigure) {
        const folder = unconfiguredWorkspaceFolders.find(
          (folder) => folder.name === folderName
        );
        if (folder) {
          console.log('configured PhiTemplater for: ', folder.name);
          configurePhiTemplaterForWorkspace(folder);
        }
      }
    } else {
      window.showErrorMessage(
        'Something went wrong: unconfigured workspace folders'
      );
    }
  } else {
    window.showErrorMessage('Something went wrong: workspace folders');
  }
}

const getConfig = async () => {
  const configFile = (
    await workspace.findFiles('*/phiTemplater.config.json')
  )[0];
  const configBytes = await workspace.fs.readFile(configFile);
  const configRaw = new TextDecoder().decode(configBytes);
  const config: PhiTemplaterConfig = JSON.parse(configRaw);
  return config;
};
