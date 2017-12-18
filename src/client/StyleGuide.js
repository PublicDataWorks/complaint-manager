import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import {Card, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Subheader from 'material-ui/Subheader';
import {List, ListItem} from 'material-ui/List';
import {GridList, GridTile} from 'material-ui/GridList'

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
        background: color,
        height: 100,
        margin: 20,
        padding: 10,
        display: 'inline-block'
    });


const StyleGuide = () => (
    <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
        <div>
            <AppBar title="Style Guide"/>
            <Card zDepth={0} style={{fontSize: "24pt", fontWeight: "bold"}}>
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


            <Card zDepth={0} style={{marginTop: 30}}>
                <CardTitle title="COLORS" style={{fontSize: "24pt", fontWeight: "bold"}}/>
                <Subheader style={subheader}>Primary</Subheader>
                <Card zDepth={0} style={{display: 'inline-block'}}>
                    <GridList style={{display: 'flex', flexWrap: 'nowrap', width: 300}} cols={2} padding={10} cellHeight={'auto'}>
                        <GridTile
                            style={getBoxStyle("#673ab7")}
                            title="Primary"
                            subtitle="#673ab7"
                            titleBackground="#FFFFFF"
                            titleStyle={{color: '#000a12'}}
                            subtitleStyle={{color: '#000a12'}}
                        />
                        <GridTile
                            style={getBoxStyle("#9a67ea")}
                            title="P - Light"
                            subtitle="#9a67ea"
                            titleBackground="#FFFFFF"
                            titleStyle={{color: '#000a12'}}
                            subtitleStyle={{color: '#000a12'}}
                        />
                        <GridTile
                            style={getBoxStyle("#320b86")}
                            title="P - Dark"
                            subtitle="#320b86"
                            titleBackground="#FFFFFF"
                            titleStyle={{color: '#000a12'}}
                            subtitleStyle={{color: '#000a12'}}
                        />
                    </GridList>
                </Card>


                <Subheader style={subheader}>Secondary</Subheader>

                <Card zDepth={0} style={{display: 'inline-block'}}>
                    <GridList style={{display: 'flex', flexWrap: 'nowrap', width: 300}} cols={2} padding={10} cellHeight={'auto'}>
                        <GridTile
                            style={getBoxStyle("#90a4ae")}
                            title="Secondary"
                            subtitle="#90a4ae"
                            titleBackground="#FFFFFF"
                            titleStyle={{color: '#000a12'}}
                            subtitleStyle={{color: '#000a12'}}
                        />
                        <GridTile
                            style={getBoxStyle("#eceff1")}
                            title="S - Lighter"
                            subtitle="#eceff1"
                            titleBackground="#FFFFFF"
                            titleStyle={{color: '#000a12'}}
                            subtitleStyle={{color: '#000a12'}}
                        />
                        <GridTile
                            style={getBoxStyle("#c1d5e0")}
                            title="S - Light"
                            subtitle="#c1d5e0"
                            titleBackground="#FFFFFF"
                            titleStyle={{color: '#000a12'}}
                            subtitleStyle={{color: '#000a12'}}
                        />
                        <GridTile
                            style={getBoxStyle("#62757f")}
                            title="S - Dark"
                            subtitle="#62757f"
                            titleBackground="#FFFFFF"
                            titleStyle={{color: '#000a12'}}
                            subtitleStyle={{color: '#000a12'}}
                        />
                        <GridTile
                            style={getBoxStyle("#000a12")}
                            title="S - Darker"
                            subtitle="#000a12"
                            titleBackground="#FFFFFF"
                            titleStyle={{color: '#000a12'}}
                            subtitleStyle={{color: '#000a12'}}
                        />
                    </GridList>
                </Card>


                <Subheader style={subheader}>Info, Error, and warning colors</Subheader>
                <Card zDepth={0} style={{display: 'inline-block'}}>
                    <GridList style={{display: 'flex', flexWrap: 'nowrap', width: 300}} cols={2} padding={10} cellHeight={'auto'}>
                        <GridTile
                            style={getBoxStyle("#1565c0")}
                            title="Blue"
                            subtitle="#1565c0"
                            titleBackground="#FFFFFF"
                            titleStyle={{color: '#000a12'}}
                            subtitleStyle={{color: '#000a12'}}
                        />
                        <GridTile
                            style={getBoxStyle("#fbc02d")}
                            title="Yellow"
                            subtitle="#fbc02d"
                            titleBackground="#FFFFFF"
                            titleStyle={{color: '#000a12'}}
                            subtitleStyle={{color: '#000a12'}}
                        />
                        <GridTile
                            style={getBoxStyle("#d32f2f")}
                            title="Red"
                            subtitle="#d32f2f"
                            titleBackground="#FFFFFF"
                            titleStyle={{color: '#000a12'}}
                            subtitleStyle={{color: '#000a12'}}
                        />
                        <GridTile
                            style={getBoxStyle("#388e3c")}
                            title="Green"
                            subtitle="#388e3c"
                            titleBackground="#FFFFFF"
                            titleStyle={{color: '#000a12'}}
                            subtitleStyle={{color: '#000a12'}}
                        />
                    </GridList>
                </Card>
            </Card>
        </div>
    </MuiThemeProvider>
);

export default StyleGuide;