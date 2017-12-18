import React from 'react';
import IconButton from 'material-ui/IconButton';
import ActionHome from 'material-ui/svg-icons/action/home';
import ActionAccountCircle from 'material-ui/svg-icons/action/account-circle';
import AppBar from 'material-ui/AppBar';

const ViewAllCases = () => (
    <div>
        <AppBar
            title={"View All Cases"}
            iconElementLeft={
                <IconButton>
                    <ActionHome />
                </IconButton>}
            iconElementRight={
                <IconButton>
                    <ActionAccountCircle />
                </IconButton>
            }
        />
    </div>
);

export default ViewAllCases;