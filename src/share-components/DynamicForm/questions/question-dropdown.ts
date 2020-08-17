import { QuestionBase } from './question-base';
import { FormConfig } from '../form.config';

export class DropdownQuestion extends QuestionBase<string> {
  controlType = '';
  options: {key: string, value: string}[] = [];

  constructor(options: any) {
    super(options);
    this.options = options['options'] || [];
    this.controlType = new FormConfig().questionControlType.dropdown;
  }
}
