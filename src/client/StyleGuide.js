import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import {Card, CardTitle, CardText} from 'material-ui/Card';


const StyleGuide = () => (
    <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
        <div>
            <AppBar title="Style Guide"/>
            <Card>
                <CardTitle title="TYPOGRAPHY"/>
                <CardText style={{"color": "#673ab7", "font-size": "24pt"}}>
                    Headline Regular 24pt
                </CardText>
            </Card>
            <Card>
                <CardText style={{"color": "#673ab7", "font-size": "20pt"}}>
                    Title Medium 20pt
                </CardText>
            </Card>
        </div>
    </MuiThemeProvider>
);

export default StyleGuide;