# Phi Templater

Create re-usable templates to easily generate files and folders in your projects. Supports the use of variables in the file body or file name for dynamic templates.

## How to

### 1. Install Phi Templater

Install Phi Templater from the [VS Code Marketplace](https://marketplace.visualstudio.com/vscode)

### 2. Create Templates Folder

Create a folder in your workspace called `phiTemplates/`. This folder will house templates that can be used in this workspace. The name and path to this folder can be customized in the extension settings. Additionally, you may also create a global templates folder for templates to be used across multiple projects. See [Extension Settings](#extension-settings).

### 3. Create a Template

Add another folder within `phiTemplates/` to represent a template. The name of the template is the folder name. For example, a folder at `phiTemplates/myTemplate/` would create an empty template called `myTemplate`. Add any files and folders you want to your newly created template folder. For example, `phiTemplates/myTemplate/myFunction.ts`.

### 4. Use Template Syntax

Phi Templater currently supports basic variables within your templates. You can add variables within the contents of your files, as well as the names of your files and folders. Optionally, add the `.phitemp` file extension to avoid unwanted syntax highlighting and errors. Variables are denoted with a `$` prefix and suffix (they can be escaped with `\$`).

Folder name example (without variable): `myFolder`.

Folder name example (with variable): `my$x$Folder`.

File name example (without variable): `myFunction.ts`.

File name example (with variable): `$functionName$.ts.phitemp`.

File content example:

```
export function $functionName$($args$): $returnType$ {
    // $comment$
    const x: $returnType$ = null;
    return x;
}
```

### 5. Instance A Template

When you are ready to instance a template into one of your projects, right-click on the target folder in the File Explorer and select `Instance Phi Template` from the menu. This will create a pop-up that allows you to choose which template you want. After selecting a template, you will be prompted to fill in the values of all the template's variables.

Viola!

## Extension Settings

This extension contributes the following settings:

- `phiTemplater.templatePath.local`: Provide a path to your workspace's templates folder. The path should be relative to your workspace.
- `phiTemplater.templatePath.global`: Provide a path (absolute) to a global templates folder on your machine that you can use in any of your projects (not synced between machines).

## Known Issues

None. Please provide feedback if you encounter any bugs.

## Roadmap

- Template syntax highlighting
- Template language expansion
  - built-in functions (variable transformation, variable order, etc)
  - arrays
  - looping
  - logical operators
- File icons

## Release Notes

### 1.0.0

Initial release of Phi Templater.
