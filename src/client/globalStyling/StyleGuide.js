import React from 'react'
import Card, {CardContent} from 'material-ui/Card';
import GridList, {GridListTile, GridListTileBar} from 'material-ui/GridList'
import Typography from 'material-ui/Typography'
import NavBar from '../sharedComponents/NavBar/NavBar'
import StyledLink from '../sharedComponents/StyledLink'
import {CancelButton, SubmitButton} from '../sharedComponents/StyledButtons'
import {withTheme} from "material-ui";
import LinkButton from "../sharedComponents/LinkButton";

const getBoxStyle = (color) => (
    {
        width: 150,
        background: color,
        height: 100,
        margin: 20,
        padding: 10,
        display: 'inline-block'
    });


const StyleGuide = (props) => (
    <div>
        <NavBar>Style Guide</NavBar>
        <Card elevation={0} style={{marginTop: 30, backgroundColor: 'white'}}>
            <Typography variant='title' style={{marginLeft: 20}}>TYPOGRAPHY</Typography>
            <CardContent>
                <Typography variant="title">{`Title`}</Typography>
                <Typography variant="subheading">{`Subtitle`}</Typography>
                <Typography variant="body1">{`Body`}</Typography>
                <Typography variant="body2">{`Section`}</Typography>
                <Typography variant="caption">{`Caption`}</Typography>
                <Typography variant="display1">{`Hint Text`}</Typography>
                <Typography variant="button" style={{color: 'black'}}>{`Button`}</Typography>
                <StyledLink style={{marginRight: 20}}>{'Link'}</StyledLink>
            </CardContent>
        </Card>

        <Card elevation={0} style={{marginTop: 30, backgroundColor: 'white'}}>
            <Typography variant='title' style={{marginLeft: 20}}>COLORS</Typography>
            <Typography variant="subheading" style={{marginLeft: 20}}>Primary</Typography>
            <Card elevation={0} style={{marginTop: 30, backgroundColor: 'white'}}>
                <GridList style={{flexWrap: 'nowrap'}} cols={2} cellHeight={'auto'}>
                    <GridListTile
                        style={getBoxStyle(props.theme.palette.primary.main)}
                    >
                        <GridListTileBar
                            title="Primary"
                            subtitle="#673ab7"
                            position="bottom"
                            style={{background: props.theme.palette.primary.main}}
                        />
                    </GridListTile>
                    <GridListTile
                        style={getBoxStyle(props.theme.palette.primary.light)}
                    >
                        <GridListTileBar
                            title="P - Light"
                            subtitle="#9a67ea"
                            position="bottom"
                            style={{background: props.theme.palette.primary.light}}
                        />
                    </GridListTile>
                    <GridListTile
                        style={getBoxStyle(props.theme.palette.primary.dark)}
                    >
                        <GridListTileBar
                            title="P - Dark"
                            subtitle="#320b86"
                            position="bottom"
                            style={{background: props.theme.palette.primary.dark}}
                        />
                    </GridListTile>
                </GridList>
            </Card>


            <Typography variant="subheading" style={{marginLeft: 20}}>Secondary</Typography>

            <Card elevation={0} style={{marginTop: 30, backgroundColor: 'white'}}>
                <GridList style={{flexWrap: 'nowrap'}} cols={2} padding={10} cellHeight={'auto'}>
                    <GridListTile
                        style={getBoxStyle(props.theme.palette.secondary.main)}
                    >
                        <GridListTileBar
                            title="Secondary"
                            subtitle="#62757f"
                            style={{background: props.theme.palette.secondary.main}}
                        />
                    </GridListTile>
                    <GridListTile
                        style={getBoxStyle(props.theme.palette.secondary.light)}
                    >
                        <GridListTileBar
                            title="S - Light"
                            subtitle="#eceff1"
                            style={{background: props.theme.palette.secondary.light}}
                        />
                    </GridListTile>
                    <GridListTile
                        style={getBoxStyle(props.theme.palette.secondary.dark)}
                    >
                        <GridListTileBar
                            title="S - Dark"
                            subtitle="#000a12"
                            style={{background: props.theme.palette.secondary.dark}}
                        />
                    </GridListTile>
                </GridList>
            </Card>


            <Typography variant="subheading" style={{marginLeft: 20}}>Info, Error, and Warning colors</Typography>
            <Card elevation={0} style={{marginTop: 30, backgroundColor: 'white'}}>
                <GridList style={{flexWrap: 'nowrap'}} cols={2} padding={10} cellHeight={'auto'}>
                    <GridListTile
                        style={getBoxStyle(props.theme.palette.blue)}
                    >
                        <GridListTileBar
                            title="Blue"
                            subtitle="#1565c0"
                            style={{background: props.theme.palette.blue}}
                        />
                    </GridListTile>
                    <GridListTile
                        style={getBoxStyle(props.theme.palette.yellow)}
                    >
                        <GridListTileBar
                            title="Yellow"
                            subtitle="#fbc02d"
                            style={{background: props.theme.palette.yellow}}
                        />
                    </GridListTile>
                    <GridListTile
                        style={getBoxStyle(props.theme.palette.error.main)}
                    >
                        <GridListTileBar
                            title="Red"
                            subtitle="#d32f2f"
                            style={{background: props.theme.palette.error.main}}
                        />
                    </GridListTile>
                    <GridListTile
                        style={getBoxStyle(props.theme.palette.green)}
                    >
                        <GridListTileBar
                            title="Green"
                            subtitle="#388e3c"
                            style={{background: props.theme.palette.green}}
                        />
                    </GridListTile>
                </GridList>
            </Card>
        </Card>

        <Card elevation={0} style={{marginTop: 30, backgroundColor: 'white'}}>
            <Typography variant='title' style={{marginLeft: 20}}>BUTTONS</Typography>
            <CardContent>
                <CancelButton style={{marginRight: 20}}>Cancel Button</CancelButton>
                <SubmitButton style={{marginRight: 20}}>Submit Button</SubmitButton>
                <LinkButton>Link Button</LinkButton>
            </CardContent>
        </Card>
    </div>
)

export default withTheme()(StyleGuide)