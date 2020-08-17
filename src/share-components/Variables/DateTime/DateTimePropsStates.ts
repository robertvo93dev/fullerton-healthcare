export interface DateTimeProps {
    dateTime?: Date,
    onSelectionChange: (selected: DateTimeStates) => void,
    referenceKey: string
}

export interface DateTimeStates {
    referenceKey: string,
    originalDateTime?: Date,
    dateTime?: Date,
}

export const initialDateTimeStates: DateTimeStates = {
    referenceKey: '',
    originalDateTime: undefined,
    dateTime: undefined
}