import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Link, Switch, Route, RouteComponentProps, withRouter } from 'react-router-dom';

import { Booking } from '../../../class/booking';
import BookingComponent from '../../../components/Booking/Booking';
import { Config } from '../../../configuration/config';
import { AppState } from '../../store';
import { Table } from '../../../share-components/Table/Table';
import { BookingService } from '../../../service/Booking.service';
import { SelectColumnFilter } from '../../../share-components/Table/Filter/Filter';
import { CommonService } from '../../../service/common.service';
import { ReactModal, ModalActionType } from '../../../share-components/Modal/Modal';
import { DynamicFormStates } from '../../../share-components/DynamicForm';

interface RouteLocation {
    isNeedReload?: string;
}

interface BookingContainerProps extends RouteComponentProps<{}, {}, RouteLocation> {
    user: any
}

interface BookingContainerStates {
    allBooking: Booking[],
    bookingList: Booking[],
    isLoading: boolean,
    modalConfig: any
}

const ContainerDiv = styled.div`
    min-height: calc(100vh - 80px);
`;

class BookingContainer extends Component<BookingContainerProps, BookingContainerStates> {
    bookingService: BookingService;
    commonService: CommonService;
    config: Config;
    constructor(props: BookingContainerProps) {
        super(props);

        this.state = {
            allBooking: [],
            bookingList: [],
            isLoading: false,
            modalConfig: {}
        }
        this.bookingService = new BookingService();
        this.commonService = new CommonService();
        this.config = new Config();

        this.deleteBookingHandler = this.deleteBookingHandler.bind(this);
        this.addBookingHandler = this.addBookingHandler.bind(this);
        this.handleCreateBookingAction = this.handleCreateBookingAction.bind(this);
    }

    async componentDidMount() {
        let bookings = this.state.allBooking;
        if (this.props.user.currentUser.isHr) {
            //login user = company HR => get only bookings created by he/she
            bookings = await this.bookingService.getByUser(this.props.user.currentUser._id);
        }
        else if (this.props.user.currentUser.isAdmin) {
            //login user = admin => get all bookings
            bookings = await this.bookingService.getAllData();
        }

        this.setState({
            allBooking: bookings,
            isLoading: false
        });
    }

    componentDidUpdate() {
        if (this.props.location.state && this.props.location.state.isNeedReload === 'true') {
            //reload page when isloading = true
            window.location.reload();
        }
    }

    /**
     * Handle delete Booking
     * @param records deleted records
     */
    async deleteBookingHandler(records: Booking[]) {
        //get all un-pending booking that be selected
        let unPendingRecords = records.filter((value) => {
            return value.status.key !== this.config.bookingStatus.pendingReview.key;
        });

        if (unPendingRecords.length > 0) {
            //there are some record with status are not pending for review
            alert('Could not delete [un-pending] booking');
        }
        else if (window.confirm("Do you want to delete the selected record(s)?")) {
            //handle delete record after confirming
            await this.bookingService.deleteRecords(records);
            window.location.reload();
        }
    }

    /**
     * Handle create booking
     */
    async handleCreateBookingAction(action: any, form: DynamicFormStates) {
        //Hide popup
        this.setState({
            modalConfig: {}
        });
        //handle create booking when user confirm
        if (action === ModalActionType.OK) {
            //get Booking object from dynamic form
            let booking = this.bookingService.convertFormToObject(form, new Booking());
            //set status = pending review after creating
            booking.status = this.config.bookingStatus.pendingReview;
            await this.bookingService.createNew(booking);
            window.location.reload();
        }
    }

    /**
     * Handle business after user click (+) New button on list
     */
    addBookingHandler() {
        //Get questions (fields) of booking that show on form to get infor from user
        let questions = this.bookingService.getQuestion(new Booking());
        //Set value for popup
        this.setState({
            modalConfig: {
                show: true,
                modalTitle: 'Create new booking',
                questions: questions
            }
        });
    }

    render() {
        //Define column that be displayed on table
        const columns = [
            {
                Header: 'Location',
                id: 'location',
                accessor: 'location',
                Cell: ({ row }: { row: any }) => (<Link to={`bookings/${row.original._id}`}>{row.original.location}</Link>)
            },
            {
                Header: 'Event Type',
                id: 'eventType',
                Filter: SelectColumnFilter,
                filter: 'includes',
                accessor: (row: Booking) => {
                    let result = '';
                    if (row.eventType) {
                        result = row.eventType.name
                    }
                    return result;
                },
            },
            {
                Header: 'Status',
                id: 'status',
                Filter: SelectColumnFilter,
                filter: 'includes',
                accessor: (row: Booking) => {
                    let result = '';
                    if (row.status) {
                        result = row.status.value
                    }
                    return result;
                },
            },
            {
                Header: 'Proposed 1',
                id: 'proposedDateTime1',
                accessor: (row: Booking) => {
                    let result = '';
                    if (row.proposedDateTime1) {
                        let accessor = new Date(row.proposedDateTime1);
                        result = this.commonService.convertDateToStringByFormat(accessor, this.config.datetimeFormat.yyyyMMddHHmm)
                    }
                    return result;
                }
            },
            {
                Header: 'Proposed 2',
                id: 'proposedDateTime2',
                accessor: (row: Booking) => {
                    let result = '';
                    if (row.proposedDateTime2) {
                        let accessor = new Date(row.proposedDateTime2);
                        result = this.commonService.convertDateToStringByFormat(accessor, this.config.datetimeFormat.yyyyMMddHHmm)
                    }
                    return result;
                }
            },
            {
                Header: 'Proposed 3',
                id: 'proposedDateTime3',
                accessor: (row: Booking) => {
                    let result = '';
                    if (row.proposedDateTime3) {
                        let accessor = new Date(row.proposedDateTime3);
                        result = this.commonService.convertDateToStringByFormat(accessor, this.config.datetimeFormat.yyyyMMddHHmm)
                    }
                    return result;
                }
            },
            {
                Header: 'Approved Date',
                id: 'choosenDateTime',
                accessor: (row: Booking) => {
                    let result = '';
                    if (row.choosenDateTime) {
                        let accessor = new Date(row.choosenDateTime);
                        result = this.commonService.convertDateToStringByFormat(accessor, this.config.datetimeFormat.yyyyMMddHHmm)
                    }
                    return result;
                }
            },
            {
                Header: 'Reject reason',
                id: 'reasonForRejection',
                accessor: 'reasonForRejection'
            },
            {
                Header: 'Created By',
                id: 'createdBy',
                accessor: (row: Booking) => row.createdBy ? `${row.createdBy.firstName} ${row.createdBy.lastName}` : ''
            },
            {
                Header: 'Created',
                id: 'createdDate',
                accessor: (row: Booking) => {
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
                accessor: (row: Booking) => row.updatedBy ? `${row.updatedBy.firstName} ${row.updatedBy.lastName}` : ''
            },
            {
                Header: 'Updated',
                id: 'updatedDate',
                accessor: (row: Booking) => {
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
                                onActionFire={this.handleCreateBookingAction}
                                questions={this.state.modalConfig.questions} />
                        ) : ('')
                }
                <Switch>
                    <Route exact path="/bookings">
                        <ContainerDiv>
                            <Table columns={columns}
                                data={this.state.allBooking}
                                pageCount={this.state.allBooking.length}
                                fetchData={()=>{}}
                                deleteRecordHandler={this.deleteBookingHandler}
                                showSelection={
                                    //Admin could not delete bookings
                                    this.props.user.currentUser.isHr
                                }
                                showAddRecord={
                                    //Admin could not create new booking
                                    this.props.user.currentUser.isHr
                                }
                                addRecordHandler={this.addBookingHandler}
                                TableName="Bookings"
                            />
                        </ContainerDiv>
                    </Route>
                    <Route path={`/bookings/:bookingId`}>
                        <BookingComponent />
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
};

export default withRouter(connect(MapStatesToProps, MapDispatchToProps)(BookingContainer))