import * as vscode from 'vscode';
import { TemplateInstancer } from '../templateInstancer';

export async function instanceTemplate(
  templateTargetUri: vscode.Uri
): Promise<void> {
  const { workspace, window } = vscode;
  const config: vscode.WorkspaceConfiguration =
    workspace.getConfiguration('phiTemplater');
  const { local: localTemplatePath, global: globalTemplatePath } =
    config.templatePath;

  // error handling
  const isWorkspaceOpen = workspace.workspaceFolders !== undefined;
  if (!isWorkspaceOpen) {
    window.showErrorMessage('Open a workspace to use Phi Templater');
    return;
  }
  const isLocalTemplatePathDefined =
    localTemplatePath !== '' ||
    localTemplatePath === null ||
    localTemplatePath === undefined;
  const isGlobalTemplatePathDefined =
    globalTemplatePath !== '' ||
    globalTemplatePath === null ||
    globalTemplatePath === undefined;
  if (!isLocalTemplatePathDefined && !isGlobalTemplatePathDefined) {
    window.showErrorMessage(
      'No global or local path to template directories has been specified. Go to the extension settings.'
    );
    return;
  }
  let localTemplateDirectoryContents: [string, vscode.FileType][] | null = null;
  let globalTemplateDirectoryContents: [string, vscode.FileType][] | null =
    null;
  const localTemplateUri = vscode.Uri.file(
    `${workspace.workspaceFolders[0].uri.path}/${localTemplatePath}`
  );
  const globalTemplateUri = vscode.Uri.file(globalTemplatePath);
  if (isLocalTemplatePathDefined) {
    try {
      localTemplateDirectoryContents = await workspace.fs.readDirectory(
        localTemplateUri
      );
    } catch (error) {
      window.showErrorMessage(
        `template directory does not exist at path \'${localTemplatePath}\'.`
      );
      return;
    }
  }
  if (isGlobalTemplatePathDefined) {
    try {
      globalTemplateDirectoryContents = await workspace.fs.readDirectory(
        globalTemplateUri
      );
    } catch (error) {
      window.showErrorMessage(
        `template directory does not exist at path \'${globalTemplatePath}\'.`
      );
      return;
    }
  }

  // get user template selection
  const localTemplateQuickPickItems: vscode.QuickPickItem[] =
    localTemplateDirectoryContents
      ? localTemplateDirectoryContents
          ?.filter((dirCont) => dirCont[1] === vscode.FileType.Directory)
          .map((dirCont) => ({
            label: dirCont[0],
            description: 'local',
          }))
      : [];
  const globalTemplateQuickPickItems: vscode.QuickPickItem[] =
    globalTemplateDirectoryContents
      ? globalTemplateDirectoryContents
          ?.filter((dirCont) => dirCont[1] === vscode.FileType.Directory)
          .map((dirCont) => ({
            label: dirCont[0],
            description: 'global',
          }))
      : [];
  if (
    localTemplateQuickPickItems.length === 0 &&
    globalTemplateQuickPickItems.length === 0
  ) {
    window.showErrorMessage(`No templates have been created yet.`);
    return;
  }
  const templateChooserOptions = {
    title: 'Choose Template',
    placeHolder: 'search templates',
  };
  const pickedTemplate = await window.showQuickPick(
    [...localTemplateQuickPickItems, ...globalTemplateQuickPickItems],
    templateChooserOptions
  );
  if (pickedTemplate === undefined) {
    return;
  }

  // instance template
  const templateSourceUri: vscode.Uri = vscode.Uri.joinPath(
    pickedTemplate.description === 'local'
      ? localTemplateUri
      : globalTemplateUri,
    pickedTemplate.label
  );

  try {
    const templateInstancer = new TemplateInstancer(templateSourceUri);
    await templateInstancer.instanceTemplate(templateTargetUri);
  } catch (error) {
    let errorMessage = 'Phi Templater error: ';
    if (error instanceof Error) {
      errorMessage += error.message;
    } else if (error instanceof vscode.FileSystemError) {
      errorMessage += error.message;
    } else {
      errorMessage += 'unkwown error';
    }
    vscode.window.showErrorMessage(errorMessage);
  }
}
