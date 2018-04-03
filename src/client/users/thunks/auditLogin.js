import getAccessToken from "../../auth/getAccessToken";
import config from "../../config/config";

const auditLogin = async () => {
    const hostname = config[process.env.NODE_ENV].hostname;
    const token = getAccessToken();
    await fetch(`${hostname}/api/audit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({log: 'Logged In'})
    }).catch((error) => {
        console.log(error);
    });
};

export default auditLogin;