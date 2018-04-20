import React, {Component} from 'react'
import ActivityDisplay from "./ActivityDisplay";
import * as _ from 'lodash'
import getRecentActivity from "../../thunks/getRecentActivity";
import {Typography} from "material-ui";

class RecentActivity extends Component {

    componentDidMount() {
        this.props.dispatch(getRecentActivity(this.props.caseId))
    }

    render() {
        const {recentActivity} = this.props
        return (
            <div style={{margin: '0px 24px'}}>
                <Typography
                    type={'title'}
                    style={{
                        marginBottom: '16px'
                    }}
                >
                    Recent Activity
                </Typography>
                <div data-test="recentActivityContainer">
                    {
                        _.orderBy(recentActivity, ['createdAt'], 'desc').map(activity => {
                            return (
                                <ActivityDisplay
                                    key={activity.id}
                                    activity={activity}
                                    data-test="recentActivityItem"
                                />
                            )
                        })
                    }
                </div>

            </div>
        )
    }
}

export default RecentActivity