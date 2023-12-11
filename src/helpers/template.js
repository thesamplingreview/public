import fs from 'fs';
import path from 'path';
import ejs from 'ejs';

export function getEjsTemplate(templateName, data) {
  const templatePath = path.resolve(process.cwd(), 'src/emails', `${templateName}.ejs`);
  const template = fs.readFileSync(templatePath, 'utf-8');
  return ejs.render(template, data);
}
