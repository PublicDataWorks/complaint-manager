import React from 'react'
import Card, {CardHeader, CardContent} from 'material-ui/Card';
import GridList, {GridListTileBar, GridListTile} from 'material-ui/GridList'
import colors from './colors';
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton';
import HomeIcon from 'material-ui-icons/Home';
import AccountCircleIcon from 'material-ui-icons/AccountCircle';
import { AppBar, Toolbar } from 'material-ui';
import StyledLink from './StyledLink'

const getBoxStyle = (color) => (
    {
        width: 150,
        background: color,
        height: 100,
        margin: 20,
        padding: 10,
        display: 'inline-block'
    });


const StyleGuide = () => (
    <div>
        <AppBar position="static">
            <Toolbar>
                <IconButton>
                    <HomeIcon/>
                </IconButton>
                <Typography
                    data-test="pageTitle"
                    type="title"
                    color="inherit"
                >
                    Style Guide
                </Typography>
                <IconButton>
                    <AccountCircleIcon/>
                </IconButton>
            </Toolbar>
        </AppBar>
        <Card elevation={0}>
            <CardHeader title="TYPOGRAPHY"/>
            <CardContent>
                <Typography type="headline">Headline (Regular 24pt)</Typography>
                <Typography type="title">Title (Bold 20pt)</Typography>
                <Typography type="subheading">Subheading (Regular 16pt)</Typography>
                <Typography type="body2">Body 2 (Bold 14pt)</Typography>
                <Typography type="body">Body 1 (Regular 14pt)</Typography>
                <Typography type="caption">Caption (Regular 12pt)</Typography>
                <Typography type="button">Button (Bold 14pt)</Typography>
                <StyledLink href="http://google.com"> Link (Bold 16pt)</StyledLink>
                {/*ask Monica about link typography usage*/}
            </CardContent>
        </Card>


        <Card elevation={0} style={{marginTop: 30}}>
            <CardHeader title="COLORS" style={{fontSize: "24pt", fontWeight: "bold"}}/>
            <Typography type="subheading" style={{marginLeft: 20}}>Primary</Typography>
            <Card elevation={0} style={{display: 'inline-block'}}>
                <GridList style={{flexWrap: 'nowrap'}} cols={2} cellHeight={'auto'}>
                    <GridListTile
                        style={getBoxStyle(colors.primary[500])}
                    >
                        <GridListTileBar
                            title="Primary"
                            subtitle="#673ab7"
                            // titleBackground="#FFFFFF"
                            // titleStyle={{color: colors.secondaryDarker}}
                            // subtitleStyle={{color: colors.secondaryDarker}}
                            position="bottom"
                            style={{background: colors.primary[500]}}
                        />
                    </GridListTile>
                    <GridListTile
                        style={getBoxStyle(colors.primary[300])}
                    >
                        <GridListTileBar
                            title="P - Light"
                            subtitle="#9a67ea"
                            position="bottom"
                            style={{background: colors.primary[300]}}
                        />
                    </GridListTile>
                    <GridListTile
                        style={getBoxStyle(colors.primary[900])}
                    >
                        <GridListTileBar
                            title="P - Dark"
                            subtitle="#320b86"
                            position="bottom"
                            style={{background: colors.primary[900]}}
                        />
                    </GridListTile>
                </GridList>
            </Card>


            <Typography type="subheading" style={{marginLeft: 20}}>Secondary</Typography>

            <Card elevation={0} style={{display: 'inline-block'}}>
                <GridList style={{flexWrap: 'nowrap'}} cols={2} padding={10} cellHeight={'auto'}>
                    <GridListTile
                        style={getBoxStyle(colors.secondary[500])}
                    >
                        <GridListTileBar
                            title="Secondary"
                            subtitle="#90a4ae"
                            style={{background: colors.secondary[500]}}
                        />
                    </GridListTile>
                    <GridListTile
                        style={getBoxStyle(colors.secondary[50])}
                    >
                        <GridListTileBar
                            title="S - Lighter"
                            subtitle="#eceff1"
                            style={{background: colors.secondary[50]}}
                        />
                    </GridListTile>
                    <GridListTile
                        style={getBoxStyle(colors.secondary[300])}
                    >
                    <GridListTileBar
                        title="S - Light"
                        subtitle="#c1d5e0"
                        style={{background: colors.secondary[300]}}
                    />
                    </GridListTile>
                    <GridListTile
                        style={getBoxStyle(colors.secondary[700])}
                    >
                        <GridListTileBar
                            title="S - Dark"
                            subtitle="#62757f"
                            style={{background: colors.secondary[700]}}
                        />
                    </GridListTile>
                    <GridListTile
                        style={getBoxStyle(colors.secondary[900])}
                    >
                        <GridListTileBar
                            title="S - Darker"
                            subtitle="#000a12"
                            style={{background: colors.secondary[900]}}
                        />
                    </GridListTile>
                </GridList>
            </Card>


            <Typography type="subheading" style={{marginLeft: 20}}>Info, Error, and Warning colors</Typography>
            <Card elevation={0} style={{display: 'inline-block'}}>
                <GridList style={{flexWrap: 'nowrap'}} cols={2} padding={10} cellHeight={'auto'}>
                    <GridListTile
                        style={getBoxStyle(colors.blue)}
                    >
                        <GridListTileBar
                            title="Blue"
                            subtitle="#1565c0"
                            style={{background: colors.blue}}
                        />
                    </GridListTile>
                    <GridListTile
                        style={getBoxStyle(colors.yellow)}
                    >
                        <GridListTileBar
                            title="Yellow"
                            subtitle="#fbc02d"
                            style={{background: colors.yellow}}
                        />
                    </GridListTile>
                    <GridListTile
                        style={getBoxStyle(colors.error[500])}
                    >
                        <GridListTileBar
                            title="Red"
                            subtitle="#d32f2f"
                            style={{background: colors.error[500]}}
                        />
                    </GridListTile>
                    <GridListTile
                        style={getBoxStyle(colors.green)}
                    >
                        <GridListTileBar
                            title="Green"
                            subtitle="#388e3c"
                            style={{background: colors.green}}
                        />
                    </GridListTile>
                </GridList>
            </Card>
        </Card>
    </div>
)

export default StyleGuide