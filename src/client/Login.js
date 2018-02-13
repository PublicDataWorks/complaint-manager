import React, {Component} from 'react'
import Auth from "./auth/Auth";

class Login extends Component {

    componentWillMount() {
        const auth = new Auth()
        auth.login()
    }

    render() {
        return <div></div>
    }
}

export default Login