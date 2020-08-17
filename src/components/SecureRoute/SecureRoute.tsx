import * as React from 'react';
import {
    Route,
    Redirect,
    RouteProps,
    RouteComponentProps
} from "react-router-dom";
import { connect } from 'react-redux';
import { AppState } from '../../redux/store';
import { User } from '../../class/user';

interface SecureRouteProps extends RouteProps {
    user: User;
    adminOnly?: boolean;
}

class SecureRoute extends Route<SecureRouteProps> {
    render() {
        return (
            <Route render={
                (props: RouteComponentProps) => {
                    //user haven't login yet => redirect to login page
                    if (!this.props.user._id) {
                        return <Redirect to='/login' />
                    }
                    else if(this.props.adminOnly && !this.props.user.isAdmin){
                        return <Redirect to='/page401'/>
                    }
                    else {
                        //if flag adminOnly = true => user must be admin to render the component
                        if (this.props.component) {
                            return React.createElement(this.props.component);
                        }
                        else if (this.props.render) {
                            return this.props.render(props);
                        }
                    }
                }
            } />
        );
    }
}

const MapStatesToProps = (appState: AppState) => {
    return {
        user: appState.user.currentUser
    }
}
const MapDispatchToProps = {

}
export default connect(MapStatesToProps, MapDispatchToProps)(SecureRoute)