import * as vscode from 'vscode';
import { TextDecoder } from 'node:util';

interface SquirtConfigTemplate {
  templateLocation: string;
  templateName: string;
  identifierPrefix?: string;
  identifierSuffix?: string;
}
interface SquirtConfig {
  templateDirectory: string;
  defaultIdentifierPrefix: string;
  defaultIdentifierSuffix: string;
  templates: Array<SquirtConfigTemplate>;
}
const getConfig = async () => {
  const configFile = (
    await vscode.workspace.findFiles('squirt.config.json')
  )[0];
  const configBytes = await vscode.workspace.fs.readFile(configFile);
  const configRaw = new TextDecoder().decode(configBytes);
  const config: SquirtConfig = JSON.parse(configRaw);
  return config;
};

const showTemplateChooser = () => {
  // pass
};

export function activate(context: vscode.ExtensionContext) {
  console.log('Squirt activated');

  vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
    vscode.window.showInformationMessage('omg we saved');
    console.log('omg we saved');
  });

  let squirtCmdDisposable = vscode.commands.registerCommand(
    'squirt.squirt',
    async () => {
      console.log('test');
      const config = await getConfig();
      console.log('🚀 ~ file: extension.ts:38 ~ config:', config);
      const templateNames: string[] = config.templates.map(
        (template) => template.templateName
      );
      console.log('🚀 ~ file: extension.ts:42 ~ templateNames:', templateNames);
      const templateChooserOptions = {
        title: 'Choose Template',
        placeHolder: 'search templates',
      };
      const templateName = await vscode.window.showQuickPick(
        templateNames,
        templateChooserOptions
      );
      console.log('🚀 ~ template name:', templateName);

      //   const directoryPath = __dirname; // todo came from args
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

  context.subscriptions.push(squirtCmdDisposable);
  context.subscriptions.push(updateConfigCmdDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() {
  console.log('Squirt deactivated');
}
