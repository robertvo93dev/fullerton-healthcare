import React from 'react';
import { DynamicFormProps, DynamicFormStates } from './DynamicFormPropState';
import styled from 'styled-components';
import { QuestionBase } from './questions/question-base';
import { FormConfig } from './form.config';
import { CustomDropDown, ReferenceList, DateTime, RadioButton, RadioButtonStates } from '../Variables';
import { ReferenceStates } from '../Variables/ReferenceList/ReferencePropsStates';
import { DropDownStates } from '../Variables/DropdownList/DropDownPropsStates';
import { DateTimeStates } from '../Variables/DateTime/DateTimePropsStates';
const ContainerDiv = styled.div`
`;
const DangerText: React.CSSProperties = {
    color: 'red',
    fontStyle: 'italic'
};
const Margin0: React.CSSProperties = {
    margin: 0
};
export class DynamicForm extends React.Component<DynamicFormProps, DynamicFormStates>{
    formConfig: FormConfig;
    constructor(props: DynamicFormProps) {
        super(props);

        this.formConfig = new FormConfig();
        this.state = {
            originalListFields: {},
            listFields: {},
            errors: {},
            disableSubmitButton: true
        };

        this.renderErrorMessage = this.renderErrorMessage.bind(this);
        this.renderQuestion = this.renderQuestion.bind(this);
        this.validateForm = this.validateForm.bind(this);
        //handle change
        this.handleChange = this.handleChange.bind(this);
        this.onSelectionChangeCallback = this.onSelectionChangeCallback.bind(this);
        this.onSelectionReferenceListChange = this.onSelectionReferenceListChange.bind(this);
        this.onselectionDateTimeChange = this.onselectionDateTimeChange.bind(this);
        this.onRadioSelectionChange = this.onRadioSelectionChange.bind(this);
    }

    componentDidMount() {
        //wait for update from container element
        let listFields: { [s: string]: any } = {};
        this.props.ListFields.forEach((val) => {
            listFields[val.key] = val.value;
        });
        this.setState({
            listFields: listFields,
            originalListFields: JSON.parse(JSON.stringify(listFields))
        });
    }

    componentDidUpdate() {
        //wait for update from container element
        let listFields: { [s: string]: any } = {};
        this.props.ListFields.forEach((val) => {
            listFields[val.key] = val.value;
        });
        //If list of fields change => update state
        if (JSON.stringify(this.state.originalListFields) !== JSON.stringify(listFields)) {
            this.setState({
                listFields: listFields,
                originalListFields: JSON.parse(JSON.stringify(listFields))
            }, () => {
                //Validate the form
                let { errors, valid } = this.validateForm();
                let disabled = !valid;
                this.setState({
                    disableSubmitButton: disabled,
                    errors
                });
            });
        }
    }

    /**
     * Handle date time selection changed
     * @param e date time state
     */
    onselectionDateTimeChange(e: DateTimeStates) {
        let listFields = this.state.listFields;
        let newDate = e.dateTime;
        listFields[e.referenceKey] = newDate;
        //update new value
        this.setState({
            listFields: listFields
        }, () => {
            //validate the form
            let { errors, valid } = this.validateForm();
            let disabled = !valid;
            this.setState({
                disableSubmitButton: disabled,
                errors
            });
        })
    }

    /**
     * Handle reference list selected record
     * @param e reference state
     */
    onSelectionReferenceListChange(e: ReferenceStates) {
        let listFields = this.state.listFields;
        listFields[e.referenceKey] = e.selected;
        //udate new value
        this.setState({
            listFields
        }, () => {
            //validate the form
            let { errors, valid } = this.validateForm();
            let disabled = !valid;
            this.setState({
                disableSubmitButton: disabled,
                errors
            });
        });
    }

    /**
     * Handle dropdown list change
     * @param e Dropdown state
     */
    onSelectionChangeCallback(e: DropDownStates) {
        let listFields = this.state.listFields;
        listFields[e.dropdownKey] = e.selected;
        //update new value
        this.setState<never>({
            listFields
        }, () => {
            //validate form
            let { errors, valid } = this.validateForm();
            let disabled = !valid;
            this.setState({
                disableSubmitButton: disabled,
                errors
            });
        });
    }

    /**
     * Handle radio button changed
     * @param value Radio button state
     */
    onRadioSelectionChange(value: RadioButtonStates) {
        let listFields = this.state.listFields;
        listFields[value.referenceKey] = value.value ? JSON.parse(value.value) : value.value;
        //update new value
        this.setState<never>({
            listFields
        }, () => {
            //validate form
            let { errors, valid } = this.validateForm();
            let disabled = !valid;
            this.setState({
                disableSubmitButton: disabled,
                errors
            });
        });
    }

    /**
     * Handle input change
     * @param event event
     */
    handleChange(event: any) {
        const { name, value } = event.target;
        let listFields = this.state.listFields;
        listFields[name] = value;
        //update new value
        this.setState<never>({
            listFields
        }, () => {
            //validate form
            let { errors, valid } = this.validateForm();
            let disabled = !valid;
            this.setState({
                disableSubmitButton: disabled,
                errors
            });
        });
    }

    /**
     * Validate the form
     */
    validateForm() {
        let valid = true;
        let errors: { [s: string]: string[] } = {};
        this.props.ListFields.forEach(element => {
            errors[element.key] = [];
            switch (element.controlType) {
                //validate fields with type textbox and textarea
                case this.formConfig.questionControlType.textbox:
                case this.formConfig.questionControlType.textarea:
                    for (var key1 in element.validators) {
                        switch (key1) {
                            //mandatory field
                            case this.formConfig.formValidators.require:
                                if (!(this.state.listFields[element.key] && this.state.listFields[element.key] !== "")) {
                                    errors[element.key].push(
                                        element.validators[key1].errorMessage
                                    );
                                }
                                break;
                            //min-length
                            case this.formConfig.formValidators.minLength:
                                if (!(this.state.listFields[element.key] && this.state.listFields[element.key].length >= element.validators[key].value)) {
                                    errors[element.key].push(
                                        element.validators[key1].errorMessage
                                    );
                                }
                                break;
                            //max-length
                            case this.formConfig.formValidators.maxLength:
                                if (!(this.state.listFields[element.key] && this.state.listFields[element.key].length <= element.validators[key].value)) {
                                    errors[element.key].push(
                                        element.validators[key1].errorMessage
                                    );
                                }
                                break;
                            default:
                                break;
                        }
                    }
                    break;
                //validate fields with type reference
                case this.formConfig.questionControlType.reference:
                    for (var key2 in element.validators) {
                        switch (key2) {
                            //mandatory field
                            case this.formConfig.formValidators.require:
                                if (!this.state.listFields[element.key] || this.state.listFields[element.key]._id == null) {
                                    errors[element.key].push(
                                        element.validators[key2].errorMessage
                                    );
                                }
                                break;
                            default:
                                break;
                        }
                    }
                    break;
                //validate fields with type dropdown
                case this.formConfig.questionControlType.dropdown:
                    for (var key3 in element.validators) {
                        switch (key3) {
                            //mandatory field
                            case this.formConfig.formValidators.require:
                                //not have value or value is 0 = [--none--]
                                if (!this.state.listFields[element.key]
                                    || !this.state.listFields[element.key].key
                                    || this.state.listFields[element.key].key === 0
                                ) {
                                    errors[element.key].push(
                                        element.validators[key3].errorMessage
                                    );
                                }
                                break;
                            default:
                                break;
                        }
                    }
                    break;
                //validate fields with type date time
                case this.formConfig.questionControlType.datetime:
                    for (var key4 in element.validators) {
                        switch (key4) {
                            //mandatory field
                            case this.formConfig.formValidators.require:
                                if (!this.state.listFields[element.key]) {
                                    errors[element.key].push(
                                        element.validators[key4].errorMessage
                                    );
                                }
                                break;
                            default:
                                break;
                        }
                    }
                    break;
                //validate fields with type radio button
                case this.formConfig.questionControlType.radiobutton:
                    for (var key5 in element.validators) {
                        switch (key5) {
                            //mandatory field
                            case this.formConfig.formValidators.require:
                                if (!this.state.listFields[element.key]) {
                                    errors[element.key].push(
                                        element.validators[key5].errorMessage
                                    );
                                }
                                break;
                            default:
                                break;
                        }
                    }
                    break;
                default:
                    break;
            }

        });
        //look at errors
        for (var key in errors) {
            if (errors[key].length > 0) {
                valid = false;
                break;
            }
        }
        return { errors, valid };
    }

    /**
     * Render error message base on question key
     * @param questionKey question key
     */
    renderErrorMessage(questionKey: string) {
        //get state.error message base on question key
        let errors = this.state.errors[questionKey];
        //if there is no error => return
        if (!errors) return;
        //else display error message
        return (
            <div style={DangerText}>
                {
                    errors.map((err, i) => (
                        <div key={i}>
                            <span>{err}</span>
                        </div>
                    ))
                }
            </div>
        );
    }

    /**
     * Render questions
     * @param question question definition
     */
    renderQuestion(question: QuestionBase<any>) {
        //depend on type of question => render appropriate element
        switch (question.controlType) {
            //question type = textbox
            case this.formConfig.questionControlType.textbox:
                return (
                    <fieldset key={question.key} className="form-group">
                        <label htmlFor={question.key}>
                            <span hidden={!question.validators['required']} style={DangerText}>* </span><span data-text={question.label}>{question.label}</span>
                        </label>
                        <input className="form-control"
                            onChange={this.handleChange}
                            readOnly={question.readonly}
                            type={question.type}
                            name={question.key}
                            value={this.state.listFields[question.key] || ''}
                            id={question.key} />
                        {this.renderErrorMessage(question.key)}
                    </fieldset>
                );
            //question type = textarea
            case this.formConfig.questionControlType.textarea:
                return (
                    <fieldset key={question.key} className="form-group">
                        <label htmlFor={question.key}>
                            <span hidden={!question.validators['required']} style={DangerText}>* </span><span data-text={question.label}>{question.label}</span>
                        </label>
                        <textarea className="form-control"
                            onChange={this.handleChange}
                            readOnly={question.readonly}
                            rows={question.rows}
                            name={question.key}
                            value={this.state.listFields[question.key]}
                            id={question.key} ></textarea>
                        {this.renderErrorMessage(question.key)}
                    </fieldset>
                );
            //question type = dropdown list
            case this.formConfig.questionControlType.dropdown:
                return (
                    <fieldset key={question.key} className="form-group">
                        <label htmlFor={question.key}>
                            <span hidden={!question.validators['required']} style={DangerText}>* </span><span data-text={question.label}>{question.label}</span>
                        </label>
                        <CustomDropDown
                            selected={question.value}
                            dropdownKey={question.key}
                            onSelectionChange={this.onSelectionChangeCallback}
                            options={question.options}
                            multiple={question.multiple}
                        ></CustomDropDown>
                        {this.renderErrorMessage(question.key)}
                    </fieldset>
                );
            //question type = reference
            case this.formConfig.questionControlType.reference:
                return (
                    <fieldset key={question.key} className="form-group">
                        <label htmlFor={question.key}>
                            <span hidden={!question.validators['required']} style={DangerText}>* </span><span data-text={question.label}>{question.label}</span>
                        </label>
                        {

                            <ReferenceList serverUrl={question.serverUrl}
                                displayField={question.displayField}
                                listFields={question.listFields}
                                filterCondition={question.filterCondition}
                                referenceKey={question.key}
                                selected={question.value}
                                onSelectionChange={this.onSelectionReferenceListChange}
                                multiple={question.multiple}
                            ></ReferenceList>

                        }
                        {this.renderErrorMessage(question.key)}
                    </fieldset>
                )
            //question type = date time
            case this.formConfig.questionControlType.datetime:
                return (
                    <fieldset key={question.key} className="form-group">
                        <label htmlFor={question.key}>
                            <span hidden={!question.validators['required']} style={DangerText}>* </span><span data-text={question.label}>{question.label}</span>
                        </label>
                        <DateTime referenceKey={question.key}
                            dateTime={question.value}
                            onSelectionChange={this.onselectionDateTimeChange}>
                        </DateTime>
                        {this.renderErrorMessage(question.key)}
                    </fieldset>
                )
            //question type = Radio button
            case this.formConfig.questionControlType.radiobutton:
                return (
                    <fieldset key={question.key} className="form-group">
                        <label htmlFor={question.key}>
                            <span hidden={!question.validators['required']} style={DangerText}>* </span><span data-text={question.label}>{question.label}</span>
                        </label>
                        <RadioButton onSelectionChange={this.onRadioSelectionChange}
                            referenceKey={question.key}
                            options={question.options} />
                        {this.renderErrorMessage(question.key)}
                    </fieldset>
                )
            default:
                break;
        }
    }

    render() {
        return (
            <ContainerDiv>
                <form onSubmit={(e) => { e.preventDefault(); this.props.OnSubmitCallback(this.state) }}>
                    {this.props.ListFields.map((field, i) => (
                        this.renderQuestion(field)
                    ))}
                    <input style={Margin0}
                        type="submit"
                        value="Submit"
                        disabled={this.state.disableSubmitButton}
                        className="btn btn-primary btn-block" />
                </form>
            </ContainerDiv>
        );
    }
}