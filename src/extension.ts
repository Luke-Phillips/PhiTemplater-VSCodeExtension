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

const getConfig = async () => {
  const configFile = (
    await vscode.workspace.findFiles('*/squirt.config.json')
  )[0];
  const configBytes = await vscode.workspace.fs.readFile(configFile);
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

  vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
    vscode.window.showInformationMessage('omg we saved');
    console.log('omg we saved');
  });

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
      const templateName = await vscode.window.showQuickPick(
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
      const templateDir = template.templateDir;
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

      //   const options = { extension: null, templatesPath: "test" }; // todo came from args
      //   const templatePath = path.resolve(
      //     __dirname,
      //     "./internalTemplates/squirtConfig.json"
      //   );
      //   const destinationFileName =
      //     ".squirtrc" + (options.extension ? ".json" : "");
      //   const destinationPath = path.resolve(directoryPath, destinationFileName);

      //   const templateFileContents = (await fs.readFile(templatePath)).toString();

      //   const defaultTemplateValues = {
      //     templatesPath: "./squirtTemplates",
      //   };

      //   const templateValues = merge(defaultTemplateValues, {
      //     templatesPath: options.templatesPath,
      //   });

      //   const destinationFileContents = tmpl(
      //     templateFileContents,
      //     templateValues
      //   );
      //   console.log("destinationPath", destinationPath);
      //   console.log("destinationFileContents", destinationFileContents);
      //   // await fs.outputFile(destinationPath, destinationFileContents)
      vscode.window.showInformationMessage(
        'Chosen template is ' + templateName
      );
    }
  );

  let updateConfigCmdDisposable = vscode.commands.registerCommand(
    'squirt.updateConfig',
    () => {
      console.log('update config test');
      vscode.window.showInformationMessage('update config test');
    }
  );

  context.subscriptions.push(squirtAltCmdDisposable);
  // context.subscriptions.push(squirtCmdDisposable);
  context.subscriptions.push(updateConfigCmdDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() {
  console.log('Squirt deactivated');
}
