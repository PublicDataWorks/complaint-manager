import auth0 from 'auth0-js';
import {authConfig as config} from "./auth0-variables"
import history from '../history';

export default class Auth {

    authConfig = config[process.env.REACT_APP_ENV || process.env.NODE_ENV]
    authWeb = new auth0.WebAuth(this.authConfig);
    auth = new auth0.Authentication({},{
        domain: this.authConfig.domain,
        clientID: this.authConfig.clientID
    });

    login = () => {
        this.authWeb.authorize();
    }

    handleAuthentication  = (callback)  => {
        this.authWeb.parseHash((err, authResult) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
                this.auth.userInfo(authResult.accessToken, (err, result) => {
                    if (!err){
                        callback(result)
                    }
                })
                this.setSession(authResult)
                history.replace('/')
            } else if (err) {
                history.replace('/')
                console.log(err)
            }
        })
    }

    setSession = (authResult) => {
        let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime())
        localStorage.setItem('access_token', authResult.accessToken)
        localStorage.setItem('id_token', authResult.idToken)
        localStorage.setItem('expires_at', expiresAt)

        history.replace('/')
    }

    logout = () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('id_token')
        localStorage.removeItem('expires_at')

        history.replace('/');
    }

    getUserInfo =  (accessToken, callback) => {
         this.auth.userInfo(accessToken, callback)
    }

    isAuthenticated = () => {
        let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        return new Date().getTime() < expiresAt;
    }
}