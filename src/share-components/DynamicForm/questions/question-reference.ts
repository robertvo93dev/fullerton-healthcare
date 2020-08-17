import { QuestionBase } from './question-base';
import { FormConfig } from '../form.config';

export class ReferenceQuestion extends QuestionBase<string> {
  controlType = '';

  constructor(options: any) {
    super(options);
    this.controlType = new FormConfig().questionControlType.reference;
  }
}
