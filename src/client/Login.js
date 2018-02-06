import React, {Component} from 'react'

class Login extends Component {

    componentWillMount() {
        this.props.auth.login()
    }

    render() {
        return <div></div>
    }
}

export default Login