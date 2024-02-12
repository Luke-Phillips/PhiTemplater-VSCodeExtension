import * as vscode from 'vscode';

import { TemplateInstanceData } from './deprecated-work/interfaces/templateInstanceInterfaces';

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
  // context.subscriptions.push(
  //   commands.registerCommand('phitemplater.configure', configurePhiTemplater)
  // );

  let phiTemplaterAltCmdDisposable = commands.registerCommand(
    'phitemplater.instanceTemplateAlt',
    async () => {
      const templatesDir = getTemplatesDir();
      console.log('🚀 ~ templatesDir:', templatesDir);
    }
  );

  // Command: Instance Phi Template
  context.subscriptions.push(
    commands.registerCommand('phitemplater.instanceTemplate', async () => {
      // const config = await getConfig();
      // const templateNames: string[] = config.templates.map(
      //   (template) => template.templateName
      // );
      // const templateChooserOptions = {
      //   title: 'Choose Template',
      //   placeHolder: 'search templates',
      // };
      // const templateName = await window.showQuickPick(
      //   templateNames,
      //   templateChooserOptions
      // );
      // if (templateName === undefined) {
      //   return;
      // }
      // //  for each file in template files
      // const template = config.templates.find(
      //   (template) => template.templateName
      // );
      // if (template === undefined) {
      //   return;
      // }
      // // const templateDir = template.templateLocation;
      // const templateDir = '';
      // const templateFiles = template.templateFiles;
      // console.log('🚀 ~ templateFiles:', templateFiles);
      // let templateInstanceData: TemplateInstanceData;
      // for (const templateFile of templateFiles) {
      //   console.log('🚀 ~ templateFile:', templateFile);
      //   // const relativePattern = new vscode.RelativePattern(
      //   //   templateDir,
      //   //   templateFile.templateFilePath
      //   // );
      //   // console.log("🚀 ~ relativePattern:", relativePattern);
      //   const files = await vscode.workspace.findFiles(
      //     'instanceTemplates/test/test.instanceTemplate'
      //   );
      //   console.log('🚀 ~ files:', files);
      //   const file = files[0];
      //   console.log('🚀 ~ file:', file);
      //   // const templateFileBytes = await vscode.workspace.fs.readFile(file);
      //   // console.log("🚀 ~ templateFileBytes:", templateFileBytes);
      //   // const templateFileRaw = new TextDecoder().decode(templateFileBytes);
      //   // console.log("🚀 ~ templateFileRaw:", templateFileRaw);
      // }
      // //    for each variable
      // //      show in multi step quick pick and get value
      // //    store contents of file
      // // create every file or dir/.../file with filled variables
      // //   const directoryPath = __dirname; // todo came from args
      // //   const options = { extension: null, templatesPath: 'test' }; // todo came from args
      // //   const templatePath = path.resolve(
      // //     __dirname,
      // //     "./internalTemplates/phiTemplaterConfig.json"
      // //   );
      // //   const destinationFileName =
      // //     ".phitemplaterc" + (options.extension ? ".json" : "");
      // //   const destinationPath = path.resolve(directoryPath, destinationFileName);
      // //   const templateFileContents = (await fs.readFile(templatePath)).toString();
      // //   const defaultTemplateValues = {
      // //     templatesPath: "./phiTemplates",
      // //   };
      // //   const templateValues = merge(defaultTemplateValues, {
      // //     templatesPath: options.templatesPath,
      // //   });
      // //   const destinationFileContents = tmpl(
      // //     templateFileContents,
      // //     templateValues
      // //   );
      // //   console.log('destinationPath', destinationPath);
      // //   console.log('destinationFileContents', destinationFileContents);
      // //   // await fs.outputFile(destinationPath, destinationFileContents)
      // window.showInformationMessage('Chosen template is ' + templateName);
    })
  );

  context.subscriptions.push(phiTemplaterAltCmdDisposable);
  // context.subscriptions.push(phiTemplaterCmdDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() {
  console.log('Phi Templater deactivated');
}
