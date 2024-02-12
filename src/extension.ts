import * as vscode from 'vscode';
import { TextDecoder } from 'node:util';
import {
  PhiTemplaterConfig,
  PhiTemplaterConfigTemplate,
  PhiTemplaterConfigTemplateFile,
} from './interfaces/configInterfaces';
import { TemplateInstanceData } from './interfaces/templateInstanceInterfaces';

// begin alt
const getTemplatesDir = async () => {
  const configFilePath = (
    await vscode.workspace.findFiles('*/phiTemplater.config.json')
  )[0];
  return configFilePath.path.split('/').slice(0, -1).join('/');
};

// const getTemplateNames = async() => {

//   return []
// }
// end alt

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

// Show QuickPick and return user-chosen template
const getTemplateToInstance = () => {
  // pass
};

export function activate(context: vscode.ExtensionContext) {
  console.log('Phi Templater activated');

  workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
    console.log('omg we saved');
  });

  // TODO: enable this only when phiTemplater is not already configured OR window error when attempted
  context.subscriptions.push(
    commands.registerCommand('phitemplater.configure', configurePhiTemplater)
  );

  let phiTemplaterAltCmdDisposable = commands.registerCommand(
    'phitemplater.instanceTemplateAlt',
    async () => {
      const templatesDir = getTemplatesDir();
      console.log('🚀 ~ templatesDir:', templatesDir);
    }
  );

  let phiTemplaterCmdDisposable = vscode.commands.registerCommand(
    'phitemplater.instanceTemplate',
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
          'instanceTemplates/test/test.instanceTemplate'
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
      //     "./internalTemplates/phiTemplaterConfig.json"
      //   );
      //   const destinationFileName =
      //     ".phitemplaterc" + (options.extension ? ".json" : "");
      //   const destinationPath = path.resolve(directoryPath, destinationFileName);

      //   const templateFileContents = (await fs.readFile(templatePath)).toString();

      //   const defaultTemplateValues = {
      //     templatesPath: "./phiTemplates",
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
    commands.registerCommand('phitemplater.updateConfig', () => {
      console.log('update config test');
      window.showInformationMessage('update config test');
    })
  );

  context.subscriptions.push(phiTemplaterAltCmdDisposable);
  // context.subscriptions.push(phiTemplaterCmdDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() {
  console.log('Phi Templater deactivated');
}
