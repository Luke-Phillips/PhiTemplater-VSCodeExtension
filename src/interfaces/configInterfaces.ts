export interface SquirtConfigTemplateFile {
  templateFilePath: string;
  templateFileInstancePath: string;
}
export interface SquirtConfigTemplate {
  templateDir: string;
  templateName: string;
  identifierPrefix?: string;
  identifierSuffix?: string;
  templateFiles: Array<SquirtConfigTemplateFile>;
}
export interface SquirtConfig {
  templatesDir: string;
  identifierPrefix: string;
  identifierSuffix: string;
  templates: Array<SquirtConfigTemplate>;
}
