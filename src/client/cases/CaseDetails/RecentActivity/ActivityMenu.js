import React from 'react';
import {IconButton, MenuItem} from "material-ui";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {Menu} from "material-ui"
import {connect} from "react-redux";
import {openRemoveUserActionDialog, openUserActionDialog} from "../../../actionCreators/casesActionCreators";

class ActivityMenu extends React.Component {
    state = {
        menuOpen: false,
        anchorEl: null
    }

    handleMenuOpen = (event) => {
        this.setState({
            menuOpen: true,
            anchorEl: event.currentTarget
        })
    }

    handleMenuClose = () => {
        this.setState({menuOpen: false, anchorEl: null})
    }

    handleEditNoteClick = () => {
        this.props.dispatch(openUserActionDialog())
        this.handleMenuClose()
    }

    handleRemoveNoteClick = () => {
        this.props.dispatch(openRemoveUserActionDialog(this.props.caseId, this.props.activityId))
        this.handleMenuClose()
    }

    render() {

        return (
            <div>
                <IconButton
                    data-test="activityMenuButton"
                    onClick={this.handleMenuOpen}
                >
                    <MoreVertIcon/>
                </IconButton>
                <Menu
                    open={this.state.menuOpen}
                    anchorEl={this.state.anchorEl}
                    onClose={this.handleMenuClose}
                >
                    <MenuItem
                        data-test="editMenuItem"
                        onClick={this.handleEditNoteClick}
                    >
                        Edit Note
                    </MenuItem>
                    <MenuItem
                        data-test="removeMenuItem"
                        onClick={this.handleRemoveNoteClick}
                    >
                        Remove Note
                    </MenuItem>
                </Menu>
            </div>
        )
    }
}

export default connect()(ActivityMenu);