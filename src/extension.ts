import * as vscode from 'vscode';
import { TextDecoder } from 'node:util';
import {
  SquirtConfig,
  SquirtConfigTemplate,
  SquirtConfigTemplateFile,
} from './interfaces/configInterfaces';
import { TemplateInstanceData } from './interfaces/templateInstanceInterfaces';

// begin alt
const getTemplatesDir = async () => {
  const configFilePath = (
    await vscode.workspace.findFiles('*/squirt.config.json')
  )[0];
  return configFilePath.path.split('/').slice(0, -1).join('/');
};

// const getTemplateNames = async() => {

//   return []
// }
// end alt

const { commands, window, workspace } = vscode;

const isSquirtConfigured = async (
  workspaceFolder?: vscode.WorkspaceFolder
): Promise<boolean> => {
  if (!workspaceFolder) {
    return (
      (await workspace.findFiles('squirt.config.json', null, 1)).length > 0
    );
  }
  const configFilePattern = new vscode.RelativePattern(
    workspaceFolder,
    '**/squirt.config.json'
  );
  return (await workspace.findFiles(configFilePattern, null, 1)).length > 0;
};

function configureSquirtForWorkspace(workspaceFolder: vscode.WorkspaceFolder) {
  const workspaceFolderPath = workspaceFolder.uri.fsPath;
  const squirtConfigFileUri = vscode.Uri.file(
    workspaceFolderPath + '/squirt.config.json'
  );
  const configFileEdit = new vscode.WorkspaceEdit();
  const squirtContentBuffer = Buffer.from(
    `{\n  "templatesLocation": "./squirtTemplates",\n  "templates": []\n}`
  );
  configFileEdit.createFile(squirtConfigFileUri, {
    contents: squirtContentBuffer,
  });
  workspace.applyEdit(configFileEdit);
  // TODO
  //     createSquirtTemplatesFolder()
  //     open squirt.config.json ???
}

async function configureSquirt() {
  const workspaceFolders = workspace.workspaceFolders;
  if (workspaceFolders === undefined || workspaceFolders.length === 0) {
    window.showErrorMessage('Open a workspace before configuring Squirt');
  } else if (workspaceFolders.length === 1) {
    if (await isSquirtConfigured()) {
      window.showErrorMessage('Squirt is already configured');
    } else {
      configureSquirtForWorkspace(workspaceFolders[0]);
    }
  } else if (workspaceFolders.length > 1) {
    let unconfiguredWorkspaceFolders = [];
    for (const folder of workspaceFolders) {
      if (!(await isSquirtConfigured(folder))) {
        unconfiguredWorkspaceFolders.push(folder);
      }
    }
    if (unconfiguredWorkspaceFolders.length === 0) {
      window.showErrorMessage(
        'Squirt is already configured for all workspaces'
      );
    } else if (unconfiguredWorkspaceFolders.length === 1) {
      configureSquirtForWorkspace(unconfiguredWorkspaceFolders[0]);
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
          console.log('configured squirt for: ', folder.name);
          configureSquirtForWorkspace(folder);
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
  const configFile = (await workspace.findFiles('squirt.config.json'))[0];
  const configBytes = await workspace.fs.readFile(configFile);
  const configRaw = new TextDecoder().decode(configBytes);
  const config: SquirtConfig = JSON.parse(configRaw);
  return config;
};

// Show QuickPick and return user-chosen template
const getTemplateToSquirt = () => {
  // pass
};

export function activate(context: vscode.ExtensionContext) {
  console.log('Squirt activated');

  workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
    console.log('omg we saved');
  });

  // TODO: enable this only when squirt is not already configured OR window error when attempted
  context.subscriptions.push(
    commands.registerCommand('squirt.configure', configureSquirt)
  );

  let squirtAltCmdDisposable = vscode.commands.registerCommand(
    'squirt.squirtAlt',
    async () => {
      const templatesDir = getTemplatesDir();
      console.log('🚀 ~ templatesDir:', templatesDir);
    }
  );

  let squirtCmdDisposable = vscode.commands.registerCommand(
    'squirt.squirt',
    async () => {
      const config = await getConfig();
      const templateNames: string[] = config.templates.map(
        (template) => template.templateName
      );
      const templateChooserOptions = {
        title: 'Choose Template',
        placeHolder: 'search templates',
      };
      const templateName = await window.showQuickPick(
        templateNames,
        templateChooserOptions
      );
      if (templateName === undefined) {
        return;
      }

      //  for each file in template files
      const template = config.templates.find(
        (template) => template.templateName
      );
      if (template === undefined) {
        return;
      }
      // const templateDir = template.templateLocation;
      const templateDir = '';
      const templateFiles = template.templateFiles;
      console.log('🚀 ~ templateFiles:', templateFiles);

      let templateInstanceData: TemplateInstanceData;
      for (const templateFile of templateFiles) {
        console.log('🚀 ~ templateFile:', templateFile);
        // const relativePattern = new vscode.RelativePattern(
        //   templateDir,
        //   templateFile.templateFilePath
        // );
        // console.log("🚀 ~ relativePattern:", relativePattern);
        const files = await vscode.workspace.findFiles(
          'squirtTemplates/test/test.squirt'
        );
        console.log('🚀 ~ files:', files);
        const file = files[0];
        console.log('🚀 ~ file:', file);
        // const templateFileBytes = await vscode.workspace.fs.readFile(file);
        // console.log("🚀 ~ templateFileBytes:", templateFileBytes);
        // const templateFileRaw = new TextDecoder().decode(templateFileBytes);
        // console.log("🚀 ~ templateFileRaw:", templateFileRaw);
      }
      //    for each variable
      //      show in multi step quick pick and get value
      //    store contents of file
      // create every file or dir/.../file with filled variables

      //   const directoryPath = __dirname; // todo came from args
      //   const options = { extension: null, templatesPath: 'test' }; // todo came from args
      //   const templatePath = path.resolve(
      //     __dirname,
      //     './internalTemplates/squirtConfig.json'
      //   );
      //   const destinationFileName =
      //     '.squirtrc' + (options.extension ? '.json' : '');
      //   const destinationPath = path.resolve(directoryPath, destinationFileName);

      //   const templateFileContents = (await fs.readFile(templatePath)).toString();

      //   const defaultTemplateValues = {
      //     templatesPath: './squirtTemplates',
      //   };

      //   const templateValues = merge(defaultTemplateValues, {
      //     templatesPath: options.templatesPath,
      //   });

      //   const destinationFileContents = tmpl(
      //     templateFileContents,
      //     templateValues
      //   );
      //   console.log('destinationPath', destinationPath);
      //   console.log('destinationFileContents', destinationFileContents);
      //   // await fs.outputFile(destinationPath, destinationFileContents)
      window.showInformationMessage('Chosen template is ' + templateName);
    }
  );

  context.subscriptions.push(
    commands.registerCommand('squirt.updateConfig', () => {
      console.log('update config test');
      window.showInformationMessage('update config test');
    })
  );

  context.subscriptions.push(squirtAltCmdDisposable);
  context.subscriptions.push(squirtCmdDisposable);
  // context.subscriptions.push(updateConfigCmdDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() {
  console.log('Squirt deactivated');
}
