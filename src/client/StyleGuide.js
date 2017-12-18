import React from 'react'
import {Card, CardTitle} from 'material-ui/Card';
import Subheader from 'material-ui/Subheader';
import {List, ListItem} from 'material-ui/List';
import {GridList, GridTile} from 'material-ui/GridList'
import colors from './colors';

import IconButton from 'material-ui/IconButton';
import ActionHome from 'material-ui/svg-icons/action/home';
import ActionAccountCircle from 'material-ui/svg-icons/action/account-circle';
import AppBar from 'material-ui/AppBar';

const headline = {color: colors.primary, fontSize: "24pt"};
const title = {color: colors.primary, fontSize: "20pt", fontWeight: "bold"};
const subheader = {color: colors.secondaryDarker, fontSize: "16pt"};
const body2 = {color: colors.secondaryDarker, fontSize: "14pt", fontWeight: "bold"};
const body = {color: colors.secondaryDarker, fontSize: "14pt"};
const caption = {color: colors.secondaryDarker, fontSize: "12pt"};
const button = {color: colors.primary, fontSize: "14pt", fontWeight: "bold", textTransform: "uppercase"};
const link = {color: colors.blue, fontSize: "16pt", fontWeight: "bold"};


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
    <div>
        <AppBar
            title="Style Guide"
            iconElementLeft={<IconButton> <ActionHome /></IconButton>}
            iconElementRight={<IconButton> <ActionAccountCircle /></IconButton>}
        />
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
                        style={getBoxStyle(colors.primary)}
                        title="Primary"
                        subtitle="#673ab7"
                        titleBackground="#FFFFFF"
                        titleStyle={{color: colors.secondaryDarker}}
                        subtitleStyle={{color: colors.secondaryDarker}}
                    />
                    <GridTile
                        style={getBoxStyle(colors.primaryLight)}
                        title="P - Light"
                        subtitle="#9a67ea"
                        titleBackground="#FFFFFF"
                        titleStyle={{color: colors.secondaryDarker}}
                        subtitleStyle={{color: colors.secondaryDarker}}
                    />
                    <GridTile
                        style={getBoxStyle(colors.primaryDark)}
                        title="P - Dark"
                        subtitle="#320b86"
                        titleBackground="#FFFFFF"
                        titleStyle={{color: colors.secondaryDarker}}
                        subtitleStyle={{color: colors.secondaryDarker}}
                    />
                </GridList>
            </Card>


            <Subheader style={subheader}>Secondary</Subheader>

            <Card zDepth={0} style={{display: 'inline-block'}}>
                <GridList style={{display: 'flex', flexWrap: 'nowrap', width: 300}} cols={2} padding={10} cellHeight={'auto'}>
                    <GridTile
                        style={getBoxStyle(colors.secondary)}
                        title="Secondary"
                        subtitle="#90a4ae"
                        titleBackground="#FFFFFF"
                        titleStyle={{color: colors.secondaryDarker}}
                        subtitleStyle={{color: colors.secondaryDarker}}
                    />
                    <GridTile
                        style={getBoxStyle(colors.secondaryLighter)}
                        title="S - Lighter"
                        subtitle="#eceff1"
                        titleBackground="#FFFFFF"
                        titleStyle={{color: colors.secondaryDarker}}
                        subtitleStyle={{color: colors.secondaryDarker}}
                    />
                    <GridTile
                        style={getBoxStyle(colors.secondaryLight)}
                        title="S - Light"
                        subtitle="#c1d5e0"
                        titleBackground="#FFFFFF"
                        titleStyle={{color: colors.secondaryDarker}}
                        subtitleStyle={{color: colors.secondaryDarker}}
                    />
                    <GridTile
                        style={getBoxStyle(colors.secondaryDark)}
                        title="S - Dark"
                        subtitle="#62757f"
                        titleBackground="#FFFFFF"
                        titleStyle={{color: colors.secondaryDarker}}
                        subtitleStyle={{color: colors.secondaryDarker}}
                    />
                    <GridTile
                        style={getBoxStyle(colors.secondaryDarker)}
                        title="S - Darker"
                        subtitle="#000a12"
                        titleBackground="#FFFFFF"
                        titleStyle={{color: colors.secondaryDarker}}
                        subtitleStyle={{color: colors.secondaryDarker}}
                    />
                </GridList>
            </Card>


            <Subheader style={subheader}>Info, Error, and warning colors</Subheader>
            <Card zDepth={0} style={{display: 'inline-block'}}>
                <GridList style={{display: 'flex', flexWrap: 'nowrap', width: 300}} cols={2} padding={10} cellHeight={'auto'}>
                    <GridTile
                        style={getBoxStyle(colors.blue)}
                        title="Blue"
                        subtitle="#1565c0"
                        titleBackground="#FFFFFF"
                        titleStyle={{color: colors.secondaryDarker}}
                        subtitleStyle={{color: colors.secondaryDarker}}
                    />
                    <GridTile
                        style={getBoxStyle(colors.yellow)}
                        title="Yellow"
                        subtitle="#fbc02d"
                        titleBackground="#FFFFFF"
                        titleStyle={{color: colors.secondaryDarker}}
                        subtitleStyle={{color: colors.secondaryDarker}}
                    />
                    <GridTile
                        style={getBoxStyle(colors.red)}
                        title="Red"
                        subtitle="#d32f2f"
                        titleBackground="#FFFFFF"
                        titleStyle={{color: colors.secondaryDarker}}
                        subtitleStyle={{color: colors.secondaryDarker}}
                    />
                    <GridTile
                        style={getBoxStyle(colors.green)}
                        title="Green"
                        subtitle="#388e3c"
                        titleBackground="#FFFFFF"
                        titleStyle={{color: colors.secondaryDarker}}
                        subtitleStyle={{color: colors.secondaryDarker}}
                    />
                </GridList>
            </Card>
        </Card>
    </div>
);

export default StyleGuide;