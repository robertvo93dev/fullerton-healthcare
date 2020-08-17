import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { DynamicForm, DynamicFormStates, initialDynamicFormStates } from '../DynamicForm';

interface ReactModalProps {
    show: boolean,
    modalTitle?: string,
    onActionFire: (action: any, form: DynamicFormStates) => void,
    questions: any
}

interface ReactModalState {
    show: boolean;
}

export enum ModalActionType {
    OK = 'OK',
    CANCEL = 'CANCEL'
}

export class ReactModal extends React.Component<ReactModalProps, ReactModalState> {
    constructor(props: any) {
        super(props);
        this.state = {
            show: false
        };
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.setState({
            show: this.props.show
        });
    }

    /**
     * Handle user's action: close modal
     */
    handleClose() {
        this.setState({
            show: false
        }, () => {
            this.props.onActionFire(ModalActionType.CANCEL, initialDynamicFormStates);
        });
    }

    /**
     * Handle user's action: submit modal
     * @param form 
     */
    handleSubmit(form: DynamicFormStates) {
        this.setState({
            show: false
        }, () => {
            this.props.onActionFire(ModalActionType.OK, form);
        });
    }

    render() {
        return (
            <div>
                <Modal
                    show={this.state.show}
                    onHide={this.handleClose}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>{this.props.modalTitle}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <DynamicForm ListFields={this.props.questions} OnSubmitCallback={this.handleSubmit} />
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}