import { QuestionBase } from './question-base';
import { FormConfig } from '../form.config';

export class RadioButtonQuestion extends QuestionBase<any> {
  controlType = '';
  options: {key: string, value: string}[] = [];

  constructor(options: any) {
    super(options);
    this.options = options['options'] || [];
    this.controlType = new FormConfig().questionControlType.radiobutton;
  }
}
