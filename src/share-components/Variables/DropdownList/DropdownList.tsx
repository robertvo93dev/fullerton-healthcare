import React from 'react';
import { TextField, Checkbox } from '@material-ui/core';
import Autocomplete, { AutocompleteCloseReason, AutocompleteChangeReason } from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

import { DropDownProps, DropDownStates, initialDropDownStates } from './DropDownPropsStates';
import './DropdownList.scss';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export class CustomDropDown extends React.Component<DropDownProps, DropDownStates>{
    constructor(props: DropDownProps) {
        super(props);

        this.state = initialDropDownStates;
        this.onCloseDropdown = this.onCloseDropdown.bind(this);
        this.onChangeDropdown = this.onChangeDropdown.bind(this);
    }

    componentDidMount() {
        //set selected value for default
        let selected = this.state.selected;    //default option
        if (this.props.selected)
            selected = this.props.selected;

        //get selected items to show checkbox if multiple autocomplete is enable
        if (this.props.multiple) {
            selected = [];
            this.props.options.forEach((value) => {
                if (selected && (selected as any[]).filter((val) => { return val["key"] === value["key"] }).length === 1) {
                    selected.push(value);
                }
            });
        }
        this.setState({
            selected: selected,
            originalSelected: JSON.parse(JSON.stringify(selected)),
            dropdownKey: this.props.dropdownKey
        });
    }

    componentDidUpdate() {
        //listen in case the selected value is retrieved from server
        if (JSON.stringify(this.state.originalSelected) !== JSON.stringify(this.props.selected)) {
            //get selected items to show checkbox if multiple autocomplete is enable
            let selected = this.props.selected;
            if (this.props.multiple) {
                selected = [];
                this.props.options.forEach((value) => {
                    if (this.props.selected && (this.props.selected as any[]).filter((val) => { return val["key"] === value["key"] }).length === 1) {
                        selected.push(value);
                    }
                });
            }

            this.setState({
                selected: selected,
                originalSelected: JSON.parse(JSON.stringify(selected))
            });
        }
    }

    /**
     * Handle action close dropdown list
     * @param event change event
     * @param reason reason for close
     */
    onCloseDropdown(event: React.ChangeEvent<{}>, reason: AutocompleteCloseReason) {
        //update selected value for the parent component
        this.props.onSelectionChange(this.state);
    }

    /**
     * Handle action change selection
     * @param event change event
     * @param value value selected
     * @param reason reason for change
     */
    onChangeDropdown(event: React.ChangeEvent<{}>, value: any, reason: AutocompleteChangeReason) {
        this.setState({
            selected: value
        }, () => {
            this.props.onSelectionChange(this.state);
        });
    }

    render() {
        return (
            <Autocomplete
                multiple={this.props.multiple}
                id="autocomplete-box"
                className="font-theme"
                value={(this.props.multiple && !this.state.selected) ? [] : this.state.selected}
                onClose={this.onCloseDropdown}
                onChange={this.onChangeDropdown}
                options={this.props.options}
                disableCloseOnSelect={this.props.multiple}
                autoSelect
                autoHighlight
                getOptionLabel={(option) => option['value'] ? option['value'] : ''}
                renderOption={(option, { selected }) => (
                    <React.Fragment>
                        {
                            this.props.multiple ?
                                (
                                    <Checkbox
                                        icon={icon}
                                        checkedIcon={checkedIcon}
                                        style={{ marginRight: 8 }}
                                        checked={selected}
                                    />
                                )
                                :
                                ('')
                        }
                        <span>{option.value}</span>
                    </React.Fragment>
                )}
                style={{ width: '100%' }}
                renderInput={(params) => (
                    <TextField {...params} variant="outlined" label="Please select items" placeholder="Search for items ..." />
                )}
            />
        )
    }
}