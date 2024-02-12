export interface PhiTemplaterConfigTemplateFile {
  templateFilePath: string;
  templateFileInstancePath: string;
}
export interface PhiTemplaterConfigTemplate {
  templateDir: string;
  templateName: string;
  identifierPrefix?: string;
  identifierSuffix?: string;
  templateFiles: Array<PhiTemplaterConfigTemplateFile>;
}
export interface PhiTemplaterConfig {
  templatesDir: string;
  identifierPrefix: string;
  identifierSuffix: string;
  templates: Array<PhiTemplaterConfigTemplate>;
}
