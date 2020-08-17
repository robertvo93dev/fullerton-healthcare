export interface ReferenceProps {
    serverUrl: string,
    displayField: string,   //the field will show on search bar
    listFields?: string[],  //the list of field will show in options
    filterCondition?: string,
    onSelectionChange: (selected: ReferenceStates) => void,
    selected?: any,
    referenceKey: string,
    multiple?: boolean
}

export interface ReferenceStates {
    referenceKey: string,
    originalSelected: any,
    selected: any,
    data: any[]
}

export const initialReferenceStates: ReferenceStates = {
    referenceKey: '',
    originalSelected: null,
    selected: null,
    data: []
}