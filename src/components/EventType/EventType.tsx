import React from 'react';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';

import { EventTypeService } from '../../service/EventType.service';
import { EventType } from "../../class/eventType";
import { DynamicFormStates, DynamicForm } from '../../share-components/DynamicForm';
import { AppState } from '../../redux/store';
import { updateAlert } from '../../redux/store/request/actions';
import { Config } from '../../configuration/config';

const ContainerDiv = styled.div`
    width: 40%;
    margin: auto;
    padding-top: 50px;
    padding-bottom: 100px;
    font-size: small;
    font-weight: 400;
`;

interface EventTypeProps extends RouteComponentProps<any> {
    updateAlert: typeof updateAlert
}

interface EventTypeStates {
    eventType: EventType
}

const initialEventTypeStates: EventTypeStates = {
    eventType: new EventType()
}

class EventTypeComponent extends React.Component<EventTypeProps, EventTypeStates> {
    eventTypeService: EventTypeService;
    config: Config;
    constructor(props: EventTypeProps) {
        super(props);

        this.state = initialEventTypeStates;
        this.eventTypeService = new EventTypeService();
        this.config = new Config();

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        //get EventType's detail
        let eventTypeId = this.props.match.params['typeId'];
        this.eventTypeService.getById(eventTypeId).then((eventType) => {
            this.setState({ eventType });
        });
    }

    /**
     * Handle submit EventType
     * @param form Dynamic form state
     */
    handleSubmit(form: DynamicFormStates) {
        //get EventType object from dynamic form
        let eventType = this.eventTypeService.convertFormToObject(form, this.state.eventType);
        //submit change and reload page
        this.eventTypeService.update(eventType)
            .then((result) => {
                window.location.reload();
            })
            .catch((err) => {
                let message = (err.response && err.response.data) ? err.response.data : this.config.commonMessage.updateError;
                //show error message
                this.props.updateAlert({
                    show: true,
                    value: message,
                    variant: this.config.alertVariants.danger
                });
            });
    }

    render() {
        //Get questions (fields) of EventType that show on form to get infor from user
        let questions = this.eventTypeService.getQuestion(this.state.eventType);
        return (
            <ContainerDiv>
                <DynamicForm ListFields={questions} OnSubmitCallback={this.handleSubmit} />
            </ContainerDiv>
        );
    }
}

const MapStatesToProps = (store: AppState) => ({
});

const MapDispatchToProps = {
    updateAlert
};

export default withRouter(connect(MapStatesToProps, MapDispatchToProps)(EventTypeComponent));