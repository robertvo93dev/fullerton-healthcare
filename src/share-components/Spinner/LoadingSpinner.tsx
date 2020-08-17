import React from "react";
import { css } from "@emotion/core";
import BounceLoader from "react-spinners/BounceLoader";
import { connect } from 'react-redux';
import { AppState } from "../../redux/store";
import styled from "styled-components";

const override = css`
    display: block;
    margin: 0 auto;
    margin-top: 200px;
    border-color: red;
`;
const ContainerDiv = styled.div`
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 10000;
    opacity: 0.5;
    background-color: gray;
    top: 0px;
`;

interface LoadingSpinnerProps {
    numberOfRequest: number
}

class LoadingSpinner extends React.Component<LoadingSpinnerProps, {}> {
    render() {
        return (
            <div>
                {
                    this.props.numberOfRequest > 0 ?
                        (
                            <ContainerDiv className="sweet-loading">
                                <BounceLoader
                                    css={override}
                                    size={100}
                                    loading={this.props.numberOfRequest > 0}
                                />
                            </ContainerDiv>
                        )
                        : ('')
                }
            </div>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    numberOfRequest: state.request.numberOfRequest
});

export default connect(mapStateToProps, {})(LoadingSpinner);