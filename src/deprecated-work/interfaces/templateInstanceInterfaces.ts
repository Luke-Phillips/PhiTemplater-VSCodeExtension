interface TemplateInstanceFiles {
  path: string;
  content: string;
}

export interface TemplateInstanceData {
  path: string;
  files: Array<TemplateInstanceFiles>;
}
