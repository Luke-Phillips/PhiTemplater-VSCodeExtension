import * as vscode from 'vscode';
import { TextEncoder } from 'util';

export class TemplateInstancer {
  static templateExtension = '.phitemp';

  readonly templateUri: vscode.Uri;

  fileTree: FileNode;
  identifierDictionary: IdentifierDictionary;
  identifierQueue: string[];

  constructor(uri: vscode.Uri) {
    this.templateUri = uri;
    this.fileTree = {
      type: vscode.FileType.Directory,
      parent: null,
      children: [],
      nameTokens: [],
    };
    this.identifierDictionary = {};
    this.identifierQueue = [];
  }

  async instanceTemplate(
    targetUri: vscode.Uri,
    sourceUri: vscode.Uri = this.templateUri
  ): Promise<void> {
    await this.readTemplateAsync(sourceUri);
    await this.getIdentifierValuesAsync();
    await this.writeTemplateAsync(targetUri);
  }

  async readTemplateAsync(uri: vscode.Uri, fileNode: FileNode = this.fileTree) {
    const files = await vscode.workspace.fs.readDirectory(uri);
    for (const [filePath, fileType] of files) {
      const nameTokens = this.scan(
        filePath.endsWith(TemplateInstancer.templateExtension)
          ? filePath.slice(0, -TemplateInstancer.templateExtension.length)
          : filePath
      );
      if (fileType === vscode.FileType.Directory) {
        const newNode = {
          type: fileType,
          parent: fileNode,
          children: [],
          nameTokens,
        };
        fileNode.children.push(newNode);
        this.readTemplateAsync(vscode.Uri.joinPath(uri, filePath), newNode);
      } else if (fileType === vscode.FileType.File) {
        const fileContent = (
          await vscode.workspace.fs.readFile(vscode.Uri.joinPath(uri, filePath))
        ).toString();
        const newNode = {
          type: fileType,
          nameTokens,
          parent: fileNode,
          children: [],
          contentTokens: this.scan(fileContent),
        };
        fileNode.children.push(newNode);
      } else {
        throw new Error(
          `unexpected file type in template directory. FileType: ${fileType}`
        );
      }
    }

    return fileNode;
  }

  async getIdentifierValuesAsync(): Promise<void> {
    for (const identifier of this.identifierQueue) {
      const value =
        (await vscode.window.showInputBox({
          title: 'Template Variables',
          prompt: `Enter value for: ${identifier}`,
          placeHolder: identifier,
        })) ?? '';
      this.identifierDictionary[identifier] = value;
    }
  }

  async writeTemplateAsync(targetUri: vscode.Uri): Promise<void> {
    this.fileTree.targetUri = targetUri;
    const fileNodeQueue: FileNode[] = this.fileTree.children;

    while (true) {
      const fileNode = fileNodeQueue.shift();
      if (!fileNode) {
        return;
      }
      let fileName: string = '';
      try {
        fileName = this.evaluate(fileNode.nameTokens);
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(
            `file node name tokens evaluation error: ${error.message}`
          );
        }
      }
      fileNode.targetUri = vscode.Uri.joinPath(
        fileNode.parent?.targetUri ?? targetUri,
        fileName
      );
      if (fileNode.type === vscode.FileType.Directory) {
        vscode.workspace.fs.createDirectory(fileNode.targetUri);
        for (const childFileNode of fileNode.children) {
          fileNodeQueue.push(childFileNode);
        }
      } else if (fileNode.type === vscode.FileType.File) {
        let fileContent: string = '';
        try {
          fileContent = this.evaluate(fileNode.contentTokens ?? []);
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(
              `file node content tokens evaluation error: ${error.message}`
            );
          }
        }
        vscode.workspace.fs.writeFile(
          vscode.Uri.joinPath(fileNode.targetUri),
          new TextEncoder().encode(fileContent)
        );
      } else {
        throw new Error('unknown file type in WriteTemplateAsync()');
      }
    }
  }

  scan(contents: string): Token[] {
    const tokens: Token[] = [];
    let context = ScanContext.literal;
    let currentTokenValue = '';
    for (let i = 0; i < contents.length; i++) {
      if (context === ScanContext.literal) {
        if (contents[i] === '\\') {
          if (i + 1 !== contents.length && contents[i + 1] === '$') {
            currentTokenValue += '$';
            i += 1;
          } else {
            currentTokenValue += contents[i];
          }
        } else if (contents[i] === '$') {
          tokens.push({
            type: TokenType.literal,
            value: currentTokenValue,
          });
          currentTokenValue = '';
          context = ScanContext.logic;
        } else {
          currentTokenValue += contents[i];
        }
      } else if ((context = ScanContext.logic)) {
        if (contents[i] === '$') {
          tokens.push({
            type: TokenType.identifier,
            value: currentTokenValue,
          });
          if (!(currentTokenValue in this.identifierDictionary)) {
            this.identifierDictionary[currentTokenValue] = '';
            this.identifierQueue.push(currentTokenValue);
          }
          currentTokenValue = '';
          context = ScanContext.literal;
        } else {
          currentTokenValue += contents[i];
        }
      } else {
        throw new Error('unkown context while scanning');
      }
    }
    if (context === ScanContext.literal && currentTokenValue !== '') {
      tokens.push({
        type: TokenType.literal,
        value: currentTokenValue,
      });
    }
    return tokens;
  }

  evaluate(tokens: Token[]) {
    let result = '';
    for (const token of tokens) {
      switch (token.type) {
        case TokenType.literal:
          result += token.value;
          break;
        case TokenType.identifier:
          result += this.identifierDictionary[token.value];
          break;
        default:
          throw new Error(`unaccounted for token type: ${token.type}`);
      }
    }
    return result;
  }
}

interface IdentifierDictionary {
  [identifier: string]: string;
}

interface FileNode {
  type: vscode.FileType;
  parent: FileNode | null;
  children: FileNode[];
  nameTokens: Token[];
  contentTokens?: Token[];
  targetUri?: vscode.Uri;
}

interface Token {
  type: TokenType;
  value: string;
}

enum TokenType {
  literal,
  identifier,
}

enum ScanContext {
  literal,
  logic,
}
