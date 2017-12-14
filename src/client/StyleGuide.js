import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import {Card, CardTitle, CardText} from 'material-ui/Card';

const headline = {"color": "#673ab7", "font-size": "24pt"};
const title = {"color": "#673ab7", "font-size": "20pt", "font-weight": "medium"};
const subheader = {"color": "#000a12", "font-size": "16pt"};
const body2 = {"color": "#000a12", "font-size": "14pt", "font-weight": "medium"};
const body = {"color": "#000a12", "font-size": "14pt"};
const caption = {"color": "#000a12", "font-size": "12pt"};
const button = {"color": "#673ab7", "font-size": "14pt", "font-weight": "medium", "text-transform": "uppercase"};
const link = {"color": "#1565c0", "font-size": "16pt", "font-weight": "bold"};


const StyleGuide = () => (
    <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
        <div>
            <AppBar title="Style Guide"/>
            <Card>
                <CardTitle title="TYPOGRAPHY"/>
                <CardText style={headline}>
                    Headline Regular 24pt
                </CardText>
            </Card>
            <Card>
                <CardText style={title}>
                    Title Medium 20pt
                </CardText>
            </Card>
            <Card>
                <CardText style={subheader}>
                    Subheader Regular 16pt
                </CardText>
            </Card>
            <Card>
                <CardText style={body2}>
                    Body 2/ Menu Medium 14pt
                </CardText>
            </Card>
            <Card>
                <CardText style={body}>
                    Body 1 Regular 14pt
                </CardText>
            </Card>
            <Card>
                <CardText style={caption}>
                    Caption Regular 12pt
                </CardText>
            </Card>
            <Card>
                <CardText style={button}>
                    Button medium 14pt
                </CardText>
            </Card>
            <Card>
                <CardText style={link}>
                    Link Bold 16pt
                </CardText>
            </Card>
        </div>
    </MuiThemeProvider>
);

export default StyleGuide;