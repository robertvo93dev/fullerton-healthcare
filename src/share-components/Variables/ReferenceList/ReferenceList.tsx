import React from 'react';
import { TextField, Checkbox } from '@material-ui/core';
import Autocomplete, { AutocompleteCloseReason, AutocompleteChangeReason } from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

import './ReferenceList.scss';
import { ReferenceProps, ReferenceStates, initialReferenceStates } from './ReferencePropsStates';
import { ReferenceService } from './Reference.service';
import * as apiConfig from '../../../configuration/api.config';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export class ReferenceList extends React.Component<ReferenceProps, ReferenceStates>{
    referenceService: ReferenceService;
    constructor(props: ReferenceProps) {
        super(props);

        this.state = initialReferenceStates;
        this.referenceService = new ReferenceService(apiConfig.apiConfig);
        this.onCloseDropdown = this.onCloseDropdown.bind(this);
        this.onChangeDropdown = this.onChangeDropdown.bind(this);
    }

    async componentDidMount() {
        //set selected value for default
        let selected = this.state.selected;
        if (this.props.selected)
            selected = this.props.selected;

        let allReference = await this.referenceService.getByUrl(this.props.serverUrl);
        let displayedData: any[] = [];
        allReference.forEach(element => {
            delete element['createdBy'];
            delete element['createdDate'];
            delete element['updatedBy'];
            delete element['updatedDate'];
            let newObj = JSON.parse(JSON.stringify(element));   //clone object
            //remove the fields that do not display
            if (this.props.listFields) {
                for (let p in newObj) {
                    if (this.props.listFields.indexOf(p) === -1 && p !== '_id' && p !== this.props.displayField) {
                        delete newObj[p];
                    }
                }
                displayedData.push(newObj);
            }
        });
        //get selected items to show checkbox if multiple autocomplete is enable
        if (this.props.multiple) {
            selected = [];
            displayedData.forEach((value) => {
                if (selected && (selected as any[]).filter((val) => { return val["_id"] === value["_id"] }).length === 1) {
                    selected.push(value);
                }
            });
        }

        this.setState({
            selected: selected,
            originalSelected: JSON.parse(JSON.stringify(selected)),
            referenceKey: this.props.referenceKey,
            data: displayedData
        });
    }

    componentDidUpdate() {
        //listen in case the selected value is retrieved from server
        if (JSON.stringify(this.state.originalSelected) !== JSON.stringify(this.props.selected)) {
            //get selected items to show checkbox if multiple autocomplete is enable
            let selected = this.props.selected;
            if (this.props.multiple) {
                selected = [];
                this.state.data.forEach((value) => {
                    if (this.props.selected && (this.props.selected as any[]).filter((val) => { return val["_id"] === value["_id"] }).length === 1) {
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
                options={this.state.data}
                disableCloseOnSelect={this.props.multiple}
                autoSelect
                autoHighlight
                getOptionLabel={(option) => option[this.props.displayField]}
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
                        {
                            Object.keys(option).filter((val) => {
                                return val !== '_id';
                            }).map((opt, ind) => (
                                <span className="font-theme" style={{ paddingRight: '10px' }} key={ind}>{option[opt]}</span>
                            ))
                        }
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