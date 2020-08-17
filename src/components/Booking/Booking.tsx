import React from 'react';
import styled from 'styled-components';
import { withRouter, Redirect, RouteComponentProps } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { connect } from 'react-redux';

import { Config } from '../../configuration/config';
import { BookingService } from '../../service/Booking.service';
import { Booking } from "../../class/booking";
import { User } from "../../class/user";
import { FormConfig, DynamicFormStates, DynamicForm, TextAreaQuestion, Validator, QuestionBase, RadioButtonQuestion } from '../../share-components/DynamicForm';
import { KeyValue } from '../../class/common/keyValue';
import { ReactModal, ModalActionType } from '../../share-components/Modal/Modal';
import { CommonService } from '../../service/common.service';
import { AppState } from '../../redux/store';
import { updateAlert } from '../../redux/store/request/actions';

const ContainerDiv = styled.div`
    width: 80%;
    margin: auto;
    padding-top: 50px;
    padding-bottom: 100px;
    font-size: small;
    font-weight: 400;
`;
const UiActionContainerDiv = styled.div`
    width: 100%;
    display: inline-block;
`;

interface BookingProps extends RouteComponentProps<any>{
    user: User,
    updateAlert: typeof updateAlert
}

interface BookingStates {
    booking: Booking,
    modalConfig: any,
    redirectToBookingList: boolean
}

const initialBookingStates: BookingStates = {
    booking: new Booking(),
    modalConfig: {},
    redirectToBookingList: false
}

class BookingComponent extends React.Component<BookingProps, BookingStates> {
    config: Config;
    bookingService: BookingService;
    commonService: CommonService;
    formConfig: FormConfig;
    constructor(props: BookingProps) {
        super(props);

        this.state = initialBookingStates;
        this.formConfig = new FormConfig();
        this.config = new Config();
        this.bookingService = new BookingService();
        this.commonService = new CommonService();

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleApprove = this.handleApprove.bind(this);
        this.handleReject = this.handleReject.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.renderUiAction = this.renderUiAction.bind(this);
        this.redirectToBookingList = this.redirectToBookingList.bind(this);
        this.handleBookingModalAction = this.handleBookingModalAction.bind(this);
    }

    componentDidMount() {
        //get booking's detail
        let bookingId = this.props.match.params['bookingId'];
        this.bookingService.getById(bookingId).then((booking)=> {
            this.setState({booking});
        });
    }

    /**
     * Handle submit Booking
     * @param form Dynamic form state
     */
    handleSubmit(form: DynamicFormStates) {
        //get Booking object from dynamic form
        let booking = this.bookingService.convertFormToObject(form, this.state.booking);
        //submit change and reload page
        this.bookingService.update(booking).then((result) => {
            window.location.reload();
        });
    }

    /**
     * Handle approve Booking
     */
    handleApprove() {
        //Create questions show on modal
        let questions: QuestionBase<any>[] = [];
        //Add approve date time question
        let validators: { [s: string]: Validator<any>; } = {};
        validators = {}
        validators[this.formConfig.formValidators.require] = {
            value: true,
            errorMessage: 'Approve date is required.'
        };

        let options: KeyValue[] = [];
        //Add proposed date time 1 to options
        if (this.state.booking.proposedDateTime1) {
            let accessor = new Date(this.state.booking.proposedDateTime1);
            options.push(new KeyValue({
                key: 0,
                value: this.commonService.convertDateToStringByFormat(accessor, this.config.datetimeFormat.yyyyMMddHHmm)
            }));
        }
        //Add proposed date time 2 to options
        if (this.state.booking.proposedDateTime2) {
            let accessor = new Date(this.state.booking.proposedDateTime2);
            options.push(new KeyValue({
                key: 1,
                value: this.commonService.convertDateToStringByFormat(accessor, this.config.datetimeFormat.yyyyMMddHHmm)
            }));
        }
        //Add proposed date time 3 to options
        if (this.state.booking.proposedDateTime3) {
            let accessor = new Date(this.state.booking.proposedDateTime3);
            options.push(new KeyValue({
                key: 2,
                value: this.commonService.convertDateToStringByFormat(accessor, this.config.datetimeFormat.yyyyMMddHHmm)
            }));
        }
        questions.push(new RadioButtonQuestion({
            key: 'choosenDateTime',
            label: 'Approve date',
            value: '',
            options: options,
            validators: validators,
            order: 100
        }));
        //Show modal
        this.setState({
            modalConfig: {
                show: true,
                modalTitle: 'Approve confirmation',
                action: 'approve',
                questions: questions
            }
        })
    }

    /**
     * Handle reject Booking
     */
    handleReject() {
        //Create questions show on modal
        let questions: QuestionBase<any>[] = [];
        // Add rejection reason field
        let validators: { [s: string]: Validator<any>; } = {};
        validators = {}
        validators[this.formConfig.formValidators.require] = {
            value: true,
            errorMessage: 'Rejection reason is required.'
        };
        questions.push(new TextAreaQuestion({
            key: 'reasonForRejection',
            label: 'Rejection reason',
            value: '',
            validators: validators,
            rows: 5,
            order: 100
        }));
        //Show modal
        this.setState({
            modalConfig: {
                show: true,
                modalTitle: 'Reject confirmation',
                action: 'reject',
                questions: questions
            }
        });
    }

    /**
     * Handle popup confirmation
     */
    handleBookingModalAction(action: any, form: DynamicFormStates) {
        //Hide popup
        this.setState({
            modalConfig: {}
        });
        //handle create booking when user confirm
        if (action === ModalActionType.OK) {
            let booking = this.state.booking;
            switch (this.state.modalConfig.action) {
                case 'reject':
                    //update status = reject and rejection reason
                    booking.status = this.config.bookingStatus.rejected;
                    booking.reasonForRejection = form.listFields.reasonForRejection;
                    break;
                case 'approve':
                    //Update status = approved and chosen proposed date time
                    booking.status = this.config.bookingStatus.approved;
                    let proposedDates = [
                        this.state.booking.proposedDateTime1,
                        this.state.booking.proposedDateTime2,
                        this.state.booking.proposedDateTime3
                    ];
                    booking.choosenDateTime = proposedDates[form.listFields.choosenDateTime.key];
                    break;
                default:
                    break;
            }
            //update booking and reload the page
            this.bookingService.update(booking).then((result) => {
                window.location.reload();
            });
        }
    }

    /**
     * Handle cancel Booking
     */
    handleCancel() {
        if (window.confirm("Do you want to delete this record?")) {
            //handle delete record after confirming
            this.bookingService.deleteRecords([this.state.booking]).then((result) => {
                //show success message
                this.props.updateAlert({
					show: true,
					value: this.config.commonMessage.deleteSuccess,
					variant: this.config.alertVariants.success
				});
                //Redirect to dashboard
                this.setState({
                    redirectToBookingList: true
                });
            });
        }
    }

    /**
     * Render ui action [Approve, Reject, Cancel]
     */
    renderUiAction() {
        let result;
        //UI Actions only show when status is prending preview [Cancel, Approve, Reject]
        if (this.state.booking.status && this.state.booking.status.key === this.config.bookingStatus.pendingReview.key) {
            //User is CompanyHR => show [Cancel] button
            if (this.props.user.isHr) {
                result = (
                    <UiActionContainerDiv>
                        <Button className="float-right" 
                            onClick={this.handleCancel} 
                            variant="contained" 
                            color="primary">
                            Cancel
                        </Button>
                    </UiActionContainerDiv>
                )
            }
            else if (this.props.user.isAdmin) {
                //User is admin => [show Approve, Reject] button
                result = (
                    <UiActionContainerDiv>
                        <Button className="float-right" 
                            onClick={this.handleApprove} 
                            variant="contained" 
                            color="primary">
                            Approve
                        </Button>
                        <Button className="float-right" 
                            onClick={this.handleReject} 
                            style={{ marginRight: 10 }} 
                            variant="contained" 
                            color="primary">
                            Reject
                        </Button>
                    </UiActionContainerDiv>
                )
            }
        }
        return result;
    }

    /**
     * React-router redirect to create new page
     */
    redirectToBookingList() {
        if (this.state.redirectToBookingList) {
            return (
                <Redirect push={false} to={{
                    pathname: '/bookings',
                    state: { isNeedReload: 'true' }
                }}></Redirect>
            )
        }
    }

    render() {
        //Get questions (fields) of booking that show on form to get infor from user
        let questions = this.bookingService.getQuestion(this.state.booking);
        return (
            <ContainerDiv>
                {
                    this.redirectToBookingList()
                }
                {
                    this.renderUiAction()
                }
                <DynamicForm ListFields={questions} OnSubmitCallback={this.handleSubmit} />
                {
                    this.state.modalConfig.show ?
                        (
                            <ReactModal show={this.state.modalConfig.show}
                                modalTitle={this.state.modalConfig.modalTitle}
                                questions={this.state.modalConfig.questions}
                                onActionFire={this.handleBookingModalAction} />
                        ) : ('')
                }
            </ContainerDiv>
        );
    }
}

const MapStatesToProps = (store: AppState) => {
    return {
        user: store.user.currentUser
    };
}

const MapDispatchToProps = {
    updateAlert
};

export default withRouter(connect(MapStatesToProps, MapDispatchToProps)(BookingComponent));