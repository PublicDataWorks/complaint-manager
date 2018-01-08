import React from 'react'
import Card, {CardContent} from 'material-ui/Card';
import GridList, {GridListTileBar, GridListTile} from 'material-ui/GridList'
import Typography from 'material-ui/Typography'
import NavBar from '../NavBar'
import StyledLink from '../StyledComponents/StyledLink'
import {CancelButton, SubmitButton} from '../StyledComponents/StyledButtons'
import {withTheme} from "material-ui";

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
    <Card elevation={0} style={{marginTop: 30, backgroundColor:'white'}}>
      <Typography type='title' style={{marginTop: 30, marginLeft: 20}}>TYPOGRAPHY</Typography>
      <CardContent>
        <Typography type="title">{`Title`}</Typography>
        <Typography type="subheading">{`Subtitle`}</Typography>
        <Typography type="body1">{`Body`}</Typography>
        <Typography type="caption">{`Caption`}</Typography>
        <Typography type="display1">{`Hint Text`}</Typography>
        <Typography type="button" style={{color: 'black'}}>{`Button`}</Typography>
        <StyledLink style={{marginRight: 20}}>{'Link'}</StyledLink>
      </CardContent>
    </Card>

    <Card elevation={0} style={{marginTop: 30, backgroundColor:'white'}}>
      <Typography type='title' style={{marginLeft: 20}}>COLORS</Typography>
      <Typography type="subheading" style={{marginLeft: 20}}>Primary</Typography>
      <Card elevation={0} style={{marginTop: 30, backgroundColor:'white'}}>
        <GridList style={{flexWrap: 'nowrap'}} cols={2} cellHeight={'auto'}>
          <GridListTile
            style={getBoxStyle(props.theme.palette.primary[500])}
          >
            <GridListTileBar
              title="Primary"
              subtitle="#673ab7"
              position="bottom"
              style={{background: props.theme.palette.primary[500]}}
            />
          </GridListTile>
          <GridListTile
            style={getBoxStyle(props.theme.palette.primary[300])}
          >
            <GridListTileBar
              title="P - Light"
              subtitle="#9a67ea"
              position="bottom"
              style={{background: props.theme.palette.primary[300]}}
            />
          </GridListTile>
          <GridListTile
            style={getBoxStyle(props.theme.palette.primary[900])}
          >
            <GridListTileBar
              title="P - Dark"
              subtitle="#320b86"
              position="bottom"
              style={{background: props.theme.palette.primary[900]}}
            />
          </GridListTile>
        </GridList>
      </Card>


      <Typography type="subheading" style={{marginLeft: 20}}>Secondary</Typography>

      <Card elevation={0} style={{marginTop: 30, backgroundColor:'white'}}>
        <GridList style={{flexWrap: 'nowrap'}} cols={2} padding={10} cellHeight={'auto'}>
          <GridListTile
            style={getBoxStyle(props.theme.palette.secondary[700])}
          >
            <GridListTileBar
              title="Secondary"
              subtitle="#62757f"
              style={{background: props.theme.palette.secondary[700]}}
            />
          </GridListTile>
          <GridListTile
            style={getBoxStyle(props.theme.palette.secondary[50])}
          >
            <GridListTileBar
              title="S - Lighter"
              subtitle="#eceff1"
              style={{background: props.theme.palette.secondary[50]}}
            />
          </GridListTile>
          <GridListTile
            style={getBoxStyle(props.theme.palette.secondary[300])}
          >
            <GridListTileBar
              title="S - Light"
              subtitle="#c1d5e0"
              style={{background: props.theme.palette.secondary[300]}}
            />
          </GridListTile>

          <GridListTile
            style={getBoxStyle(props.theme.palette.secondary[900])}
          >
            <GridListTileBar
              title="S - Darker"
              subtitle="#000a12"
              style={{background: props.theme.palette.secondary[900]}}
            />
          </GridListTile>
        </GridList>
      </Card>


      <Typography type="subheading" style={{marginLeft: 20}}>Info, Error, and Warning colors</Typography>
      <Card elevation={0} style={{marginTop: 30, backgroundColor:'white'}}>
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
            style={getBoxStyle(props.theme.palette.error[500])}
          >
            <GridListTileBar
              title="Red"
              subtitle="#d32f2f"
              style={{background: props.theme.palette.error[500]}}
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

    <Card elevation={0} style={{marginTop: 30, backgroundColor:'white'}}>
      <Typography type='title' style={{marginLeft: 20}}>BUTTONS</Typography>
      <CardContent>
        <CancelButton style={{marginRight: 20}}>Cancel Button</CancelButton>
        <SubmitButton>Submit Button</SubmitButton>
      </CardContent>
    </Card>
  </div>
)

export default withTheme()(StyleGuide)