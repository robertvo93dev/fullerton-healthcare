import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";

import { logoutUser } from '../../redux/store/user/actions';
import { AppState } from '../../redux/store';
import { User } from '../../class/user';
import { UserServiceApi } from '../../service/User.service';

type ToolbarProps = {
    logoutUser: typeof logoutUser,
    user: User
}
class Toolbar extends React.Component<ToolbarProps, {}> {
	userService: UserServiceApi;	//user service
    constructor(props: ToolbarProps) {
        super(props);
        
		this.userService = new UserServiceApi();

        this.logout = this.logout.bind(this);
        this.renderBookingManagement = this.renderBookingManagement.bind(this);
        this.renderProfileLink = this.renderProfileLink.bind(this);
    }

    /**
     * Handle logout action
     */
    logout() {
        this.userService.userLogout().then((res) => {
            this.props.logoutUser();
        });
    }

    /**
     * Render booking manu
     */
    renderBookingManagement() {
        let result = [];
        if (this.props.user._id !== undefined) {
            result.push(
                (<Nav.Link key="bookings_nav_link" as={Link} to="/bookings">Bookings</Nav.Link>)
            );
        }
        if(this.props.user.isAdmin){
            result.push(
                (<Nav.Link key="event_type_nav_link" as={Link} to="/eventtypes">Event Types</Nav.Link>)
            );
        }
        return result;
    }

    /**
     * Render profile menu
     */
    renderProfileLink() {
        let result;
        if (this.props.user._id != null && this.props.user._id !== '') {
            result = (
                <NavDropdown title={`${this.props.user.firstName} ${this.props.user.lastName}`} id="basic-nav-dropdown">
                    <NavDropdown.Item as={Link} to="/login" onClick={this.logout}>Logout</NavDropdown.Item>
                </NavDropdown>
            );
        }
        else {
            result = (
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
            );
        }
        return result;
    }

    render() {
        return (
            <Navbar bg="light" expand="lg">
                <Navbar.Brand as={Link} to="/bookings">Fullerton Healthcare</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        {
                            this.renderBookingManagement()
                        }
                        {
                            this.renderProfileLink()
                        }
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

const MapStatesToProps = (store: AppState) => {
    return {
        user: store.user.currentUser
    }
}
const MapDispatchToProps = {
    logoutUser
}

export default connect(MapStatesToProps, MapDispatchToProps)(Toolbar);