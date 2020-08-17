export class FormConfig {
    formValidators = {          //the understand the value => refer the attributes of Validators in angular form, see in question-control.service.ts
        require: "required",
        minLength: "minLength",
        maxLength: "maxLength",
        email: "email"
    }

    inputTypeDef = {
        button: 'button',
        checkbox: 'checkbox',
        color: 'color',
        date: 'date',
        datetime: 'datetime',
        datetimeLocal: 'datetime-local',
        email: 'email',
        file: 'file',
        hidden: 'hidden',
        image: 'image',
        month: 'month',
        number: 'number',
        password: 'password',
        radio: 'radio',
        range: 'range',
        reset: 'reset',
        search: 'search',
        submit: 'submit',
        tel: 'tel',
        text: 'text',
        time: 'time',
        url: 'url',
        week: 'week'
    }

    questionControlType = {
        textbox: 'textbox',
        textarea: 'textarea',
        dropdown: 'dropdown',
        radiobutton: 'radiobutton',
        reference: 'reference',
        datetime: 'datetime'
    }
}