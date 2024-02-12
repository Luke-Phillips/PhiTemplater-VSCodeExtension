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

const getConfig = async () => {
  const configFile = (
    await vscode.workspace.findFiles('*/phiTemplater.config.json')
  )[0];
  const configBytes = await vscode.workspace.fs.readFile(configFile);
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

  vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
    vscode.window.showInformationMessage('omg we saved');
    console.log('omg we saved');
  });

  let phiTemplaterAltCmdDisposable = vscode.commands.registerCommand(
    'phiTemplater.phiTemplaterAlt',
    async () => {
      const templatesDir = getTemplatesDir();
      console.log('🚀 ~ templatesDir:', templatesDir);
    }
  );

  let phiTemplaterCmdDisposable = vscode.commands.registerCommand(
    'phi-templater.instanceTemplate',
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

      //   const options = { extension: null, templatesPath: "test" }; // todo came from args
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
      //   console.log("destinationPath", destinationPath);
      //   console.log("destinationFileContents", destinationFileContents);
      //   // await fs.outputFile(destinationPath, destinationFileContents)
      vscode.window.showInformationMessage(
        'Chosen template is ' + templateName
      );
    }
  );

  let updateConfigCmdDisposable = vscode.commands.registerCommand(
    'phi-templater.updateConfig',
    () => {
      console.log('update config test');
      vscode.window.showInformationMessage('update config test');
    }
  );

  context.subscriptions.push(phiTemplaterAltCmdDisposable);
  // context.subscriptions.push(phiTemplaterCmdDisposable);
  context.subscriptions.push(updateConfigCmdDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() {
  console.log('Phi Templater deactivated');
}
