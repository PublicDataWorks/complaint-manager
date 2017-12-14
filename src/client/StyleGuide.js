import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import {Card, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Subheader from 'material-ui/Subheader';
import {List, ListItem} from 'material-ui/List';

const headline = {color: "#673ab7", fontSize: "24pt"};
const title = {color: "#673ab7", fontSize: "20pt", fontWeight: "bold"};
const subheader = {color: "#000a12", fontSize: "16pt"};
const body2 = {color: "#000a12", fontSize: "14pt", fontWeight: "bold"};
const body = {color: "#000a12", fontSize: "14pt"};
const caption = {color: "#000a12", fontSize: "12pt"};
const button = {color: "#673ab7", fontSize: "14pt", fontWeight: "bold", textTransform: "uppercase"};
const link = {color: "#1565c0", fontSize: "16pt", fontWeight: "bold"};


const getBoxStyle = (color) => (
    {
        width: 120,
        height: 40,
        background: color,
        margin: 20,
        padding: 10,
        display: 'inline-block'
    });


const StyleGuide = () => (
    <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
        <div>
            <AppBar title="Style Guide"/>
            <Card>
                <CardTitle title="TYPOGRAPHY"/>
                <List>
                    <ListItem style={headline} primaryText={"Headline (Regular 24pt)"} disabled={true}/>
                    <ListItem style={title} primaryText={"Title (Bold 20pt)"} disabled={true}/>
                    <ListItem style={subheader} primaryText={"Subheader (Regular 16pt)"} disabled={true}/>
                    <ListItem style={body2} primaryText={"Body 2 (Bold 14pt)"} disabled={true}/>
                    <ListItem style={body} primaryText={"Body 1 (Regular 14pt)"} disabled={true}/>
                    <ListItem style={caption} primaryText={"Caption (Regular 12pt)"} disabled={true}/>
                    <ListItem style={button} primaryText={"Button (Bold 14pt)"} disabled={true}/>
                    <ListItem style={link} primaryText={"Link (Bold 16pt)"} disabled={true}/>
                </List>
            </Card>


            <Card style={{marginTop: 60}}>
                <CardTitle title="COLORS"/>
                <Subheader style={subheader}>Primary</Subheader>
                <Card style={{width: 200, display: 'inline-block'}}>
                    <CardMedia style={getBoxStyle("#673ab7")}/>
                    <CardTitle>Primary #673ab7</CardTitle>
                </Card>
                <Card style={{width: 200, display: 'inline-block'}}>
                    <CardMedia style={getBoxStyle("#9a67ea")}/>
                    <CardTitle>P - Light #9a67ea</CardTitle>
                </Card>
                <Card style={{width: 200, display: 'inline-block'}}>
                    <CardMedia style={getBoxStyle("#320b86")}/>
                    <CardTitle>P - Dark #320b86</CardTitle>
                </Card>


                <Subheader style={subheader}>Secondary</Subheader>
                <Card style={{width: 200, display: 'inline-block'}}>
                    <CardMedia style={getBoxStyle("#90a4ae")}/>
                    <CardTitle>Secondary #90a4ae</CardTitle>
                </Card>
                <Card style={{width: 200, display: 'inline-block'}}>
                    <CardMedia style={getBoxStyle("#eceff1")}/>
                    <CardTitle>S - Lighter #eceff1</CardTitle>
                </Card>
                <Card style={{width: 200, display: 'inline-block'}}>
                    <CardMedia style={getBoxStyle("#c1d5e0")}/>
                    <CardTitle>S - Light #c1d5e0</CardTitle>
                </Card>
                <Card style={{width: 200, display: 'inline-block'}}>
                    <CardMedia style={getBoxStyle("#62757f")}/>
                    <CardTitle>S - Dark #62757f</CardTitle>
                </Card>
                <Card style={{width: 200, display: 'inline-block'}}>
                    <CardMedia style={getBoxStyle("#000a12")}/>
                    <CardTitle>S - Darker #000a12</CardTitle>
                </Card>


                <Subheader style={subheader}>Info, Error, and warning colors</Subheader>
                <Card style={{width: 200, display: 'inline-block'}}>
                    <CardMedia style={getBoxStyle("#1565c0")}/>
                    <CardTitle>Blue #fbc02d</CardTitle>
                </Card>
                <Card style={{width: 200, display: 'inline-block'}}>
                    <CardMedia style={getBoxStyle("#fbc02d")}/>
                    <CardTitle>Yellow #fbc02d</CardTitle>
                </Card>
                <Card style={{width: 200, display: 'inline-block'}}>
                    <CardMedia style={getBoxStyle("#d32f2f")}/>
                    <CardTitle>Red #fbc02d</CardTitle>
                </Card>
                <Card style={{width: 200, display: 'inline-block'}}>
                    <CardMedia style={getBoxStyle("#388e3c")}/>
                    <CardTitle>Green #388e3c</CardTitle>
                </Card>
            </Card>
        </div>
    </MuiThemeProvider>
);

export default StyleGuide;