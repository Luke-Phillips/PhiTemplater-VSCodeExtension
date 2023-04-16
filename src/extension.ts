import * as vscode from "vscode";
import { TextDecoder } from "node:util";

export function activate(context: vscode.ExtensionContext) {
  console.log("Congratulations, you are squirting!");

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
      await vscode.workspace.findFiles("squirt.config.json")
    )[0];
    const configBytes = await vscode.workspace.fs.readFile(configFile);
    const configRaw = new TextDecoder().decode(configBytes);
    const config: SquirtConfig = JSON.parse(configRaw);
    return config;
  };

  const showTemplateChooser = () => {
    // pass
  };

  let disposable = vscode.commands.registerCommand(
    "squirt.squirt",
    async () => {
      const config = await getConfig();
      const templateNames: string[] = config.templates.map(
        (template) => template.templateName
      );
      const qpOptions = {
        title: "Choose Squirt Template",
        placeHolder: "search templates",
      };
      const templateName = await vscode.window.showQuickPick(
        templateNames,
        qpOptions
      );
      console.log("🚀 ~ template name:", templateName);
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
        "Chosen template is " + templateName
      );
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
