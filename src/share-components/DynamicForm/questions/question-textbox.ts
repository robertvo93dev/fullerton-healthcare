import { QuestionBase } from './question-base';
import { FormConfig } from '../form.config';

export class TextboxQuestion extends QuestionBase<string> {
  controlType = '';
  type: string;

  constructor(options: any) {
    super(options);
    this.type = options['type'] || '';
    this.controlType = new FormConfig().questionControlType.textbox;
  }
}
