export const authConfig = {
    development: {
        domain: 'noipm.auth0.com',
        clientID: '2o6uTkEwbxxU6tzKwG24ghmAtPBEKeKI',
        redirectUri: 'http://localhost:3000/callback',
        audience: 'https://noipm-staging.herokuapp.com/',
        responseType: 'token id_token',
        scope: 'openid profile'
    },
    test: {
        domain: 'noipm.auth0.com',
        clientID: '2o6uTkEwbxxU6tzKwG24ghmAtPBEKeKI',
        redirectUri: 'http://localhost:3000/callback',
        audience: 'test audience',
        responseType: 'token id_token',
        scope: 'openid profile read:cases'
    },
    staging: {
        // domain: 'noipm.auth0.com',
        domain: 'noipm-production.auth0.com',
        // clientID: '2o6uTkEwbxxU6tzKwG24ghmAtPBEKeKI',
        clientID: 'i4ldwXNjx8O2JMhuHWwV4qERfClYN2bD',
        redirectUri: 'https://noipm-staging.herokuapp.com/callback',
        audience: 'https://noipm-staging.herokuapp.com/',
        responseType: 'token id_token',
        scope: 'openid profile'
    },
    production: {
        domain: 'noipm-production.auth0.com',
        clientID: 'i4ldwXNjx8O2JMhuHWwV4qERfClYN2bD',
        redirectUri: 'https://noipm-production.herokuapp.com/callback',
        audience: 'https://noipm-production.herokuapp.com/',
        responseType: 'token id_token',
        scope: 'openid profile'
    }
}