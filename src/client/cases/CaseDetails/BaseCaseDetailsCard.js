import React from 'react'
import {Card, CardContent, Divider, Typography} from "material-ui";
import { withStyles } from "material-ui";

const styles = {
    subtitle: {
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
        margin: '0 16px 16px 16px',
    }
}

const BaseCaseDetailsCard = (props) => (
    <Card
        style=
            {{
                backgroundColor: 'white',
                marginLeft: '5%',
                marginRight: '5%',
                maxWidth: '850px',
                marginBottom: '24px'
            }}
    >
        <CardContent>
            <Typography
                type='title'
            >
                {props.title}
            </Typography>
        </CardContent>
        {
            props.subtitle
                ? (
                    <div className={props.classes.subtitle}>
                        {props.subtitle}
                    </div>
                )
                : null
        }
        <Divider/>
        {props.children}
    </Card>
)

export default withStyles(styles)(BaseCaseDetailsCard)