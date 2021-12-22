import React from "react";
import {
  Card,
  CardContent,
  GridList,
  GridListTile,
  GridListTileBar,
  Typography,
  withTheme
} from "@material-ui/core";
import NavBar from "../../policeDataManager/shared/components/NavBar/NavBar";
import StyledLink from "../../policeDataManager/shared/components/StyledLink";
import {
  PrimaryButton,
  SecondaryButton
} from "../../policeDataManager/shared/components/StyledButtons";
import LinkButton from "../../policeDataManager/shared/components/LinkButton";
import { policeDataManagerMenuOptions } from "../../policeDataManager/shared/components/NavBar/policeDataManagerMenuOptions";

const getBoxStyle = color => ({
  width: 150,
  background: color,
  height: 100,
  margin: 20,
  padding: 10,
  display: "inline-block"
});

const StyleGuide = props => (
  <div data-testid="styleGuide">
    <NavBar menuType={policeDataManagerMenuOptions}>Style Guide</NavBar>
    <Card elevation={0} style={{ marginTop: 30, backgroundColor: "white" }}>
      <Typography variant="h6" style={{ marginLeft: 20 }}>
        TYPOGRAPHY
      </Typography>
      <CardContent>
        <Typography variant="h6">{`Title`}</Typography>
        <Typography variant="subtitle1">{`Subtitle`}</Typography>
        <Typography variant="body2">{`Body`}</Typography>
        <Typography variant="subtitle2">{`Section`}</Typography>i
        <Typography variant="caption">{`Caption`}</Typography>
        <Typography variant="h4">{`Hint Text`}</Typography>
        <Typography
          variant="button"
          style={{ color: "black" }}
        >{`Button`}</Typography>
        <StyledLink to={"/styleguide"} style={{ marginRight: 20 }}>
          {`Link`}
        </StyledLink>
      </CardContent>
    </Card>

    <Card elevation={0} style={{ marginTop: 30, backgroundColor: "white" }}>
      <Typography variant="h6" style={{ marginLeft: 20 }}>
        COLORS
      </Typography>
      <Typography variant="subtitle1" style={{ marginLeft: 20 }}>
        Primary
      </Typography>
      <Card elevation={0} style={{ marginTop: 30, backgroundColor: "white" }}>
        <GridList style={{ flexWrap: "nowrap" }} cols={2} cellHeight={"auto"}>
          <GridListTile style={getBoxStyle(props.theme.palette.primary.main)}>
            <GridListTileBar
              title="Primary"
              subtitle="#673ab7"
              position="bottom"
              style={{ backgroundColor: "transparent" }}
            />
          </GridListTile>

          <GridListTile style={getBoxStyle(props.theme.palette.primary.light)}>
            <GridListTileBar
              title="P - Light"
              subtitle="#9a67ea"
              position="bottom"
              style={{ backgroundColor: "transparent" }}
            />
          </GridListTile>

          <GridListTile style={getBoxStyle(props.theme.palette.primary.dark)}>
            <GridListTileBar
              title="P - Dark"
              subtitle="#320b86"
              position="bottom"
              style={{ backgroundColor: "transparent" }}
            />
          </GridListTile>
        </GridList>
      </Card>

      <Typography variant="subtitle1" style={{ marginLeft: 20 }}>
        Secondary
      </Typography>

      <Card elevation={0} style={{ marginTop: 30, backgroundColor: "white" }}>
        <GridList
          style={{ flexWrap: "nowrap" }}
          cols={2}
          padding={10}
          cellHeight={"auto"}
        >
          <GridListTile style={getBoxStyle(props.theme.palette.secondary.main)}>
            <GridListTileBar
              title="Secondary"
              subtitle="#586972"
              style={{ background: "transparent" }}
            />
          </GridListTile>

          <GridListTile
            style={getBoxStyle(props.theme.palette.secondary.light)}
          >
            <GridListTileBar
              title="S - Light"
              subtitle={"#62757f66"}
              style={{ background: "transparent" }}
            />
          </GridListTile>

          <GridListTile
            style={getBoxStyle(props.theme.palette.secondary.lighter)}
          >
            <GridListTileBar
              title="S - Lighter"
              subtitle="#eceff1"
              style={{ background: "transparent" }}
            />
          </GridListTile>
          <GridListTile style={getBoxStyle(props.theme.palette.secondary.dark)}>
            <GridListTileBar
              title="S - Dark"
              subtitle="#000a12"
              style={{ background: "transparent" }}
            />
          </GridListTile>
        </GridList>
      </Card>

      <Typography variant="subtitle1" style={{ marginLeft: 20 }}>
        Info, Error, and Warning colors
      </Typography>
      <Card elevation={0} style={{ marginTop: 30, backgroundColor: "white" }}>
        <GridList
          style={{ flexWrap: "nowrap" }}
          cols={2}
          padding={10}
          cellHeight={"auto"}
        >
          <GridListTile style={getBoxStyle(props.theme.palette.blue)}>
            <GridListTileBar
              title="Blue"
              subtitle="#1565c0"
              style={{ backgroundColor: "transparent" }}
            />
          </GridListTile>
          <GridListTile style={getBoxStyle(props.theme.palette.yellow)}>
            <GridListTileBar
              title="Yellow"
              subtitle="#fbc02d"
              style={{ backgroundColor: "transparent" }}
            />
          </GridListTile>
          <GridListTile style={getBoxStyle(props.theme.palette.error.main)}>
            <GridListTileBar
              title="Red"
              subtitle="#d32f2f"
              style={{ backgroundColor: "transparent" }}
            />
          </GridListTile>
          <GridListTile style={getBoxStyle(props.theme.palette.green)}>
            <GridListTileBar
              title="Green"
              subtitle="#328736"
              style={{ backgroundColor: "transparent" }}
            />
          </GridListTile>
        </GridList>
      </Card>
    </Card>

    <Card elevation={0} style={{ marginTop: 30, backgroundColor: "white" }}>
      <Typography variant="h6" style={{ marginLeft: 20 }}>
        BUTTONS
      </Typography>
      <CardContent>
        <PrimaryButton style={{ marginRight: 20 }}>
          Primary Button
        </PrimaryButton>
        <SecondaryButton style={{ marginRight: 20 }}>
          Secondary Button
        </SecondaryButton>
        <LinkButton>Link Button</LinkButton>
      </CardContent>
    </Card>
  </div>
);

export default withTheme(StyleGuide);
