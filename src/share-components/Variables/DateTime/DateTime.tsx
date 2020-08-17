/**
 * Require react-datepicker
 */
import React from 'react';
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import styled from 'styled-components';

import { DateTimeProps, DateTimeStates, initialDateTimeStates } from './DateTimePropsStates';
import './DateTime.scss';

const ContainerDiv = styled.div`
    width: 100%;
`;
const DateTimeDiv = styled.div`
    display: inline-block;
    width: 100%;
`;
export class DateTime extends React.Component<DateTimeProps, DateTimeStates>{
    constructor(props: DateTimeProps) {
        super(props);
        this.state = initialDateTimeStates;
        this.handleChangeDateTime = this.handleChangeDateTime.bind(this);
    }

    componentDidMount() {
        let dateTime = this.props.dateTime ? this.props.dateTime : undefined;
        this.setState({
            referenceKey: this.props.referenceKey,
            dateTime: dateTime,
            originalDateTime: this.props.dateTime ? JSON.parse(JSON.stringify(dateTime)) : undefined
        });
    }

    componentDidUpdate() {
        if(this.props.dateTime){
            //update state when the comming props changed
            if (JSON.stringify(this.state.originalDateTime) !== JSON.stringify(this.props.dateTime)) {
                this.setState({
                    dateTime: this.props.dateTime,
                    originalDateTime: JSON.parse(JSON.stringify(this.props.dateTime))
                });
            }
        }
    }

    /**
     * handle date selection changed
     * @param date selected date
     */
    handleChangeDateTime(date: Date) {
        console.log(date);
        this.setState({
            dateTime: date
        }, () => {
            this.props.onSelectionChange(this.state);
        });
    }

    render() {
        return (
            <ContainerDiv>
                <DateTimeDiv>
                    <ReactDatePicker
                        dateFormat="yyyy/MM/dd, HH:mm"
                        minDate={new Date()}
                        selected={this.state.dateTime}
                        showTimeSelect
                        timeFormat="HH:mm"
                        onChange={this.handleChangeDateTime}
                    />
                </DateTimeDiv>
            </ContainerDiv>
        )
    }
}