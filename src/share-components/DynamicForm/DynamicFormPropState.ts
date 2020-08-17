import { QuestionBase } from "./questions/question-base";


export interface DynamicFormProps {
    ListFields: QuestionBase<string>[],
    OnSubmitCallback: (form: DynamicFormStates) => void
}

export interface DynamicFormStates {
    originalListFields: any,
    listFields: any,
    errors:{[s:string]: string[]},
    disableSubmitButton: boolean
    
}

export const initialDynamicFormStates: DynamicFormStates = {
    originalListFields: {},
    listFields : {},
    errors: {},
    disableSubmitButton: true
}