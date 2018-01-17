import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Hidden from 'material-ui/Hidden';
import Divider from 'material-ui/Divider';
import MenuIcon from 'material-ui-icons/Menu';
import NavBar from "../../sharedComponents/NavBar";
import {Link} from "react-router-dom";
import LinkButton from "../../sharedComponents/LinkButton";
import {connect} from "react-redux";
import {Table, TableBody, TableCell, TableHead, TableRow} from "material-ui";
import formatName from "../../formatName";

const drawerWidth = 240;

const styles = theme => ({
    root: {
        width: '100%',
        height: 430,
        marginTop: theme.spacing.unit * 3,
        zIndex: 1,
        overflow: 'hidden',
    },
    appFrame: {
        position: 'relative',
        display: 'flex',
        width: '100%',
        height: '100%',
    },
    appBar: {
        position: 'absolute',
        marginLeft: drawerWidth,
        [theme.breakpoints.up('md')]: {
            width: `calc(100% - ${drawerWidth}px)`,
        },
    },
    navIconHide: {
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    drawerHeader: theme.mixins.toolbar,
    drawerPaper: {
        width: 250,
        [theme.breakpoints.up('md')]: {
            width: drawerWidth,
            position: 'relative',
            height: '100%',
        },
    },
    content: {
        backgroundColor: theme.palette.background.default,
        width: '100%',
        padding: theme.spacing.unit * 3,
        height: 'calc(100% - 56px)',
        marginTop: 56,
        [theme.breakpoints.up('sm')]: {
            height: 'calc(100% - 64px)',
            marginTop: 64,
        },
    },
});

class CaseDetails extends React.Component {
    state = {
        mobileOpen: false,
    };

    handleDrawerToggle = () => {
        this.setState({mobileOpen: !this.state.mobileOpen});
    };

    render() {
        if (!this.props.caseDetail) {
            return null
        }

        const {classes, theme} = this.props;

        const drawer = (
            <div>
                <LinkButton component={Link} to={'/'}>Back to all Cases</LinkButton>
                <Divider/>
                <h3 data-test="case-number">{`Case #${this.props.caseDetail.id}`}</h3>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography type='body'>Created On</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography type='body'>Created By</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography type='body'>Assigned To</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell data-test="created-on">
                                <Typography type='body'>Jan 16, 2018</Typography>
                            </TableCell>
                            <TableCell data-test="created-by">
                                <Typography type='body'>Chris Kozak</Typography>
                            </TableCell>
                            <TableCell data-test="assigned-to">
                                <Typography type='body'>Monica Shum</Typography>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                <Divider/>

            </div>
        );

        return (
            <div className={classes.root}>
                <div className={classes.appFrame}>
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton
                                color="contrast"
                                aria-label="open drawer"
                                onClick={this.handleDrawerToggle}
                                className={classes.navIconHide}
                            >
                                <MenuIcon/>
                            </IconButton>
                            <NavBar>
                                {formatName(this.props.caseDetail.firstName, this.props.caseDetail.lastName)}
                            </NavBar>
                        </Toolbar>
                    </AppBar>
                    <Hidden mdUp>
                        <Drawer
                            type="temporary"
                            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                            open={this.state.mobileOpen}
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            onClose={this.handleDrawerToggle}
                            ModalProps={{
                                keepMounted: true, // Better open performance on mobile.
                            }}
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
                    <Hidden smDown implementation="css">
                        <Drawer
                            type="permanent"
                            open
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
                    <main className={classes.content}>
                        <Typography noWrap>{'Blah Blah Blah'}</Typography>
                    </main>
                </div>
            </div>
        );
    }
}

CaseDetails.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
    caseDetail: state.cases.all.find((caseDetail) => caseDetail.id.toString() === ownProps.match.params.id)
})

export default withStyles(styles, {withTheme: true})(connect(mapStateToProps)(CaseDetails));

//TODO: Nav bar shows status in green box
//TODO: Switch to Permanent Drawer
//TODO: Wire up created-on, created-by, and assigned-to