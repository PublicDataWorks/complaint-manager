import React from 'react'
import {Card, CardContent, Divider, Typography} from "material-ui";

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
        <Divider/>
        {props.children}
    </Card>
)

export default BaseCaseDetailsCard