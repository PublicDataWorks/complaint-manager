import React from 'react'
import {Card, CardContent, Typography} from "material-ui";
import moment from "moment";

const ActivityDisplay = ({activity}) => (
    <Card
        key={activity.id}
        style={{
            marginBottom: '16px',
            backgroundColor: 'white'
        }}
        elevation={5}
    >
        <CardContent>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between'
                }}
            >
                <div>
                    <Typography
                        style={{
                            fontWeight: 'bold'
                        }}
                        data-test="actionText"
                    >
                        {activity.action}
                    </Typography>
                    <Typography
                        type={'caption'}
                        data-test="userText"
                    >
                        {activity.user}
                    </Typography>
                </div>
                <Typography
                    data-test="activityTimeText"
                    style={{
                        alignSelf: 'flex-end'
                    }}
                >
                    {`${moment(activity.createdAt, "YYYY-MM-DDTHH:mm Z").fromNow()}`}
                </Typography>
            </div>
        </CardContent>
    </Card>
)

export default ActivityDisplay