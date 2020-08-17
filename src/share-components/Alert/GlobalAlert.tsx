import React from "react";
import Alert from 'react-bootstrap/Alert';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Variant } from "react-bootstrap/esm/types";

import { AppState } from "../../redux/store";
import { updateAlert } from "../../redux/store/request/actions";

const ContainerDiv = styled.div`
    position: fixed;
    top: -20px;
    width: 100%;
    z-index: 1000000;
    padding: 30px;
`;

const CloseButton = styled.div`
    float: right;
    margin-top: -18px;
    cursor: pointer;
    margin-right: -10px;
`;

const AlertStyle: React.CSSProperties = {
    borderRadius: '.25rem'
};

interface GlobalAlertProps {
    show?: boolean,
    variant?: Variant,
    value?: any,
    updateAlert: typeof updateAlert
}

class GlobalAlert extends React.Component<GlobalAlertProps, {}> {

    componentDidUpdate(){
        if(this.props.show){
            //hide alert after 2 seconds
            setTimeout(()=>{
                this.props.updateAlert({});
            }, 2000)
        }
    }
    
    /**
     * Handle click on close button [x]
     */
    handleOnCloseButton() {
        this.props.updateAlert({});
    }

    render() {
        return (
            <div>
                {
                    this.props.show ?
                        (
                            <ContainerDiv>
                                <Alert style={AlertStyle}
                                    key="GlobalAlert"
                                    variant={this.props.variant}>
                                    <CloseButton onClick={() => this.handleOnCloseButton()}>
                                        <strong>x</strong>
                                    </CloseButton>
                                    {this.props.value}
                                </Alert>
                            </ContainerDiv>
                        )
                        : ('')
                }
            </div>
        );
    }
}

const mapStateToProps = (state: AppState) => {
    if(state.request.alertConfig){
        return {
            show: state.request.alertConfig.show,
            variant: state.request.alertConfig.variant,
            value: state.request.alertConfig.value
        }
    }
};

const MapDispatchToProps = {
    updateAlert
};

export default connect(mapStateToProps, MapDispatchToProps)(GlobalAlert);