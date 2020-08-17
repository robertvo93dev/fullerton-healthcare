import { QuestionBase } from './question-base';
import { FormConfig } from '../form.config';

export class DateTimeQuestion extends QuestionBase<Date> {
  controlType = '';

  constructor(options: any) {
    super(options);
    this.controlType = new FormConfig().questionControlType.datetime;
  }
}
