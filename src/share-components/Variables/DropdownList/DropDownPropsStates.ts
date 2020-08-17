import { KeyValue } from "../../../class/common/keyValue";

export interface DropDownProps {
    options: KeyValue[],
    dropdownKey: string,
    onSelectionChange: (selected: DropDownStates) => void,
    selected?: any,
    multiple?: boolean
}

export interface DropDownStates {
    dropdownKey: string,
    originalSelected: any,
    selected: any,
    searchKey: string,
}

export const initialDropDownStates: DropDownStates = {
    dropdownKey: '',
    originalSelected: null,
    selected: null,
    searchKey: ''
}