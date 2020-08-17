import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Link, Switch, Route, RouteComponentProps, withRouter } from 'react-router-dom';

import EventTypeComponent from '../../../components/EventType';
import { Config } from '../../../configuration/config';
import { AppState } from '../../store';
import { Table } from '../../../share-components/Table/Table';
import { CommonService } from '../../../service/common.service';
import { ReactModal, ModalActionType } from '../../../share-components/Modal/Modal';
import { DynamicFormStates } from '../../../share-components/DynamicForm';
import { EventTypeService } from '../../../service/EventType.service';
import { EventType } from '../../../class/eventType';
import { updateAlert } from '../../store/request/actions';

interface RouteLocation {
    isNeedReload?: string;
}

interface EventTypeContainerProps extends RouteComponentProps<{}, {}, RouteLocation> {
    user: any,
    updateAlert: typeof updateAlert
}

interface EventTypeContainerStates {
    allEventTypes: EventType[],
    modalConfig: any
}

const ContainerDiv = styled.div`
    min-height: calc(100vh - 80px);
`;

class EventTypeContainer extends Component<EventTypeContainerProps, EventTypeContainerStates> {
    eventTypeService: EventTypeService;
    commonService: CommonService;
    config: Config;
    constructor(props: EventTypeContainerProps) {
        super(props);

        this.state = {
            allEventTypes: [],
            modalConfig: {}
        }
        this.eventTypeService = new EventTypeService();
        this.commonService = new CommonService();
        this.config = new Config();

        this.deleteEventTypeHandler = this.deleteEventTypeHandler.bind(this);
        this.addEventTypeHandler = this.addEventTypeHandler.bind(this);
        this.handleCreateEventTypeAction = this.handleCreateEventTypeAction.bind(this);
    }

    async componentDidMount() {
        let eventTypes = await this.eventTypeService.getAllData();

        this.setState({
            allEventTypes: eventTypes
        });
    }

    /**
     * Handle delete EventType
     * @param records deleted records
     */
    async deleteEventTypeHandler(records: EventType[]) {
        let undeleteable = [
            'Dropdown with Health Talk',
            'Wellness Events',
            'Fitness Activities'
        ];
        //get un-deleteable types from selected records
        let unDeleteRecords = records.filter((value) => {
            return undeleteable.indexOf(value.name) !== -1;
        });

        if (unDeleteRecords.length > 0) {
            //there are some record with status are not pending for review
            alert('Could not delete the selected record(s)');
        }
        else if (window.confirm("Do you want to delete the selected record(s)?")) {
            //handle delete record after confirming
            await this.eventTypeService.deleteRecords(records);
            window.location.reload();
        }
    }

    /**
     * Handle create EventType
     */
    async handleCreateEventTypeAction(action: any, form: DynamicFormStates) {
        //Hide popup
        this.setState({
            modalConfig: {}
        });
        //handle create EventType when user confirm
        if (action === ModalActionType.OK) {
            //get EventType object from dynamic form
            let eventType = this.eventTypeService.convertFormToObject(form, new EventType());
            this.eventTypeService.createNew(eventType)
                .then((result) => {
                    window.location.reload();
                })
                .catch((err) => {
                    let message = (err.response && err.response.data) ? err.response.data : this.config.commonMessage.createError;
                    //show error message
                    this.props.updateAlert({
                        show: true,
                        value: message,
                        variant: this.config.alertVariants.danger
                    });
                });
        }
    }

    /**
     * Handle business after user click (+) New button on list
     */
    addEventTypeHandler() {
        //Get questions (fields) of EventType that show on form to get infor from user
        let questions = this.eventTypeService.getQuestion(new EventType());
        //Set value for popup
        this.setState({
            modalConfig: {
                show: true,
                modalTitle: 'Create new event type',
                questions: questions
            }
        });
    }

    render() {
        //Define column that be displayed on table
        const columns = [
            {
                Header: 'Name',
                id: 'name',
                accessor: 'name',
                Cell: ({ row }: { row: any }) => (<Link to={`eventtypes/${row.original._id}`}>{row.original.name}</Link>)
            },
            {
                Header: 'Created By',
                id: 'createdBy',
                accessor: (row: EventType) => row.createdBy ? `${row.createdBy.firstName} ${row.createdBy.lastName}` : ''
            },
            {
                Header: 'Created',
                id: 'createdDate',
                accessor: (row: EventType) => {
                    let result = '';
                    if (row.createdDate) {
                        let accessor = new Date(row.createdDate);
                        result = this.commonService.convertDateToStringByFormat(accessor, this.config.datetimeFormat.yyyyMMddHHmm)
                    }
                    return result;
                }
            },
            {
                Header: 'Updated By',
                id: 'updatedBy',
                accessor: (row: EventType) => row.updatedBy ? `${row.updatedBy.firstName} ${row.updatedBy.lastName}` : ''
            },
            {
                Header: 'Updated',
                id: 'updatedDate',
                accessor: (row: EventType) => {
                    let result = '';
                    if (row.updatedDate) {
                        let accessor = new Date(row.updatedDate);
                        result = this.commonService.convertDateToStringByFormat(accessor, this.config.datetimeFormat.yyyyMMddHHmm)
                    }
                    return result;
                }
            }
        ];
        return (
            <div>
                {
                    this.state.modalConfig.show ?
                        (
                            <ReactModal show={this.state.modalConfig.show}
                                modalTitle={this.state.modalConfig.modalTitle}
                                onActionFire={this.handleCreateEventTypeAction}
                                questions={this.state.modalConfig.questions} />
                        ) : ('')
                }
                <Switch>
                    <Route exact path="/eventtypes">
                        <ContainerDiv>
                            <Table columns={columns}
                                data={this.state.allEventTypes}
                                pageCount={this.state.allEventTypes.length}
                                fetchData={() => { }}
                                deleteRecordHandler={this.deleteEventTypeHandler}
                                addRecordHandler={this.addEventTypeHandler}
                                TableName="Event Types"
                            />
                        </ContainerDiv>
                    </Route>
                    <Route path={`/eventtypes/:typeId`}>
                        <EventTypeComponent />
                    </Route>
                </Switch>
            </div>
        );
    }
}

const MapStatesToProps = (store: AppState) => {
    return {
        user: store.user
    };
}

const MapDispatchToProps = {
    updateAlert
};

export default withRouter(connect(MapStatesToProps, MapDispatchToProps)(EventTypeContainer))