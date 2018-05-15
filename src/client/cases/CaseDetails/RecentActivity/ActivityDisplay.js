import React from 'react'
import {Card, CardContent, Typography} from "material-ui";
import moment from "moment";
import ActivityMenu from "./ActivityMenu";

const ActivityDisplay = ({caseId, activity}) => {
    return (
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
                            variant={'caption'}
                            data-test="userText"
                        >
                            {activity.user}
                        </Typography>
                    </div>
                    <Typography
                        data-test="activityTimeText"
                        style={{
                            alignSelf: 'flex-start'
                        }}
                    >
                        {`${moment(activity.actionTakenAt, "YYYY-MM-DDTHH:mm:ssZ").fromNow()}`}
                    </Typography>
                    <ActivityMenu
                        activityId={activity.id}
                        caseId={caseId}
                    />
                </div>
                {activity.notes ?
                    <div
                        style={{
                            marginTop:"16px"
                        }}
                    >
                        <Typography
                            variant={'caption'}
                        >
                            Notes
                        </Typography>
                        <Typography
                            data-test="notesText"
                        >
                            {activity.notes}
                        </Typography>
                    </div> : null
                }
            </CardContent>
        </Card>
    )
}

export default ActivityDisplay