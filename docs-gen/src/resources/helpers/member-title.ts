import { DeclarationReflection, ReflectionKind } from 'typedoc';
import { heading } from './heading';

export function memberTitle(this: DeclarationReflection) {
  if (this.parent?.kindOf(ReflectionKind.Enum)) {
    return '';
  }

  const md = [];
  let parentName = '';

  let headingLevel = 3;
  if (!(this as any).stickToParent) {

    if (this.parent?.kindOf(ReflectionKind.Module)) {
      headingLevel = 2;

      if (this.kind === ReflectionKind.TypeAlias) {
        // headingLevel = 4;
        headingLevel = 3;
      }
    }

    parentName = this.parent.name === '"core"' ? (headingLevel === 3 ? 'Types' : '') : this.parent.name;
  }


  md.push(heading(headingLevel));
  if (parentName) {
    md.push(`<--{"id" : "${parentName}"}--> `);
  }
  md.push(this.name);
  return md.join(' ');
}
