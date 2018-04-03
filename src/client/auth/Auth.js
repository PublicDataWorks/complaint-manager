import auth0 from 'auth0-js';
import config from '../config/config'
import history from '../history';
import auditLogin from "../users/thunks/auditLogin";

export default class Auth {

    authConfig = config[process.env.REACT_APP_ENV || process.env.NODE_ENV].auth
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
                auditLogin();
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

        history.push('/login');
    }

    getUserInfo =  (accessToken, callback) => {
         this.auth.userInfo(accessToken, callback)
    }

    isAuthenticated = () => {
        let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        return new Date().getTime() < expiresAt;
    }
}